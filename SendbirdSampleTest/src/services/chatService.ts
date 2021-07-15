import { AppState, AppStateStatus, Platform } from 'react-native'
import { injectable, inject } from 'inversify'
import SendBird, { SendBirdError } from 'sendbird'
import { BehaviorSubject } from 'rxjs'
import { takeWhile } from 'rxjs/operators'
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import env from 'react-native-config'

import { ChatUsersResponse } from '~/types/chat'
import chatErrors from '~/const/chatErrors'
import { strigifySendbirdMessage } from '~/helpers/stringifySendbirdMessage'
import { getOrCreateChatUsers } from '~/api/chat'
import { ChannelHandlerActionMap } from '~/types/actionHandlerMap'
import { ISyncManagerService, SyncManagerServiceId } from './syncManagerService'

const USER_EVENT_HANDLER = 'user_event_handler'

export interface IChatService {
  instance: SendBird.SendBirdInstance
  totalUnreadMessagesCount: BehaviorSubject<number>
  isConnected: boolean
  registerPushToken: (token: string) => Promise<string>
  unregisterPushToken: (token: string) => Promise<any>
  setupConnectAndCreateAppStateListener: () => Promise<void>
  setupChatUserData: () => Promise<void>
  connectUser: () => Promise<void>
  addCallbackToExecuteAfterConnect: (
    callback: (...args: any[]) => void,
    callbackArgs?: any[],
  ) => void
  fetchChannelByIds: (userIds: string[]) => Promise<SendBird.GroupChannel>
  fetchChannelByUrl: (channelUrl: string, isBroadcast: boolean) => Promise<SendBird.GroupChannel>
  fetchUnreadCount: () => Promise<number | undefined>
  createChannelHandler: (
    handlerId: string,
    channelHandlerActionMap: ChannelHandlerActionMap,
  ) => void
  removeChannelHandler: (handlerId: string) => void
  disconnectUser: () => void
  clearData: () => void
  getOrCreateUsers: (userIds: string[]) => Promise<ChatUsersResponse>
  sendBroadcastMessageToEvent: (eventId: string, message: string) => void
  setupMessageParams: ({
    text,
    customType,
  }: {
    text: string
    customType?: string
  }) => SendBird.UserMessageParams
  checkIfPushNotificationIsChat: (notification: FirebaseMessagingTypes.RemoteMessage) => boolean
  resolveChatPushNotification: (data: any) => any[] | null
}

@injectable()
export class ChatService implements IChatService {
  private _appState: AppStateStatus = 'active'
  private readonly _sb: SendBird.SendBirdInstance

  private readonly _totalUnreadMessagesCount: BehaviorSubject<number> = new BehaviorSubject<number>(
    0,
  )

  private readonly _isConnected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  private _channels: SendBird.GroupChannel[] = []

  private _sendbirdUser?: SendBird.User

  private _sbToken: string = env.SENDBIRD_USER_TOKEN
  private _userId: string = env.SENDBIRD_USER_ID

  private _onTotalUnreadMessageCountUpdated(totalCount: number) {
    this._totalUnreadMessagesCount.next(totalCount)
  }

  public get instance() {
    return this._sb
  }

  public get totalUnreadMessagesCount() {
    return this._totalUnreadMessagesCount
  }

  public get isConnected() {
    return this._isConnected.value
  }

  public getChannelLocally(url: string) {
    return this._channels.find((channel) => {
      return url === channel.url
    })
  }

  constructor(
    @inject(SyncManagerServiceId) private readonly _syncManagerService: ISyncManagerService,
  ) {
    this._sb = new SendBird({ appId: env.SENDBIRD_APP_ID })
    this._syncManagerService.init(this._sb)

    const userEventHandler = new this._sb.UserEventHandler()

    userEventHandler.onTotalUnreadMessageCountUpdated =
      this._onTotalUnreadMessageCountUpdated.bind(this)

    this._sb.addUserEventHandler(USER_EVENT_HANDLER, userEventHandler)
  }

  public setupConnectAndCreateAppStateListener = async () => {
    await this.connectUser()
    this._syncManagerService.setupConnectionHandler()
    this._syncManagerService.setupSyncManager()
    AppState.addEventListener('change', this.handleAppStateChange)
  }

  public async getOrCreateUsers(userIds: string[]) {
    try {
      const { data: users } = await getOrCreateChatUsers(userIds, env.BEAT_81_USER_TOKEN)
      return users
    } catch (e) {
      console.log(chatErrors.CHAT_GET_CREATE_USER_FAILED, e)
      return null
    }
  }

  public registerPushToken(token: string) {
    return new Promise((resolve: (result: string) => void, reject: () => void) => {
      if (Platform.OS === 'ios') {
        this._sb.registerAPNSPushTokenForCurrentUser(token, (result, err) => {
          if (err) {
            console.log(chatErrors.CHAT_PUSH_TOKEN_REGISTER_FAILED, strigifySendbirdMessage(err))
            reject()
            return
          }
          resolve(result)
        })
      } else {
        this._sb.registerGCMPushTokenForCurrentUser(token, (result, err) => {
          if (err) {
            console.log(chatErrors.CHAT_PUSH_TOKEN_REGISTER_FAILED, strigifySendbirdMessage(err))
            reject()
            return
          }
          resolve(result)
        })
      }
    })
  }

  public unregisterPushToken(token: string) {
    return new Promise((resolve: (result: any) => void, reject: () => void) => {
      if (Platform.OS === 'ios') {
        this._sb.unregisterAPNSPushTokenForCurrentUser(token, (result, err) => {
          if (err) {
            console.log(chatErrors.CHAT_PUSH_TOKEN_UNREGISTER_FAILED, strigifySendbirdMessage(err))
            reject()
            return
          }
          resolve(result)
        })
      } else {
        this._sb.unregisterGCMPushTokenForCurrentUser(token, (result, err) => {
          if (err) {
            console.log(chatErrors.CHAT_PUSH_TOKEN_UNREGISTER_FAILED, strigifySendbirdMessage(err))
            reject()
            return
          }
          resolve(result)
        })
      }
    })
  }

  public setupMessageParams({ text, customType = '' }: { text: string; customType?: string }) {
    const messageParams = new this._sb.UserMessageParams()
    messageParams.message = text
    messageParams.customType = customType
    return messageParams
  }

  public connectUser = async () => {
    if (this._isConnected.value) {
      return
    }

    try {
      const sendbirdUser = await this._sb.connect(this._userId, this._sbToken)
      this._sendbirdUser = sendbirdUser
      this._sb.setForegroundState()
      this._isConnected.next(true)
      this.fetchUnreadCount()
    } catch (e) {
      console.log(chatErrors.CHAT_CONNECT_FAILED, e)
    }
  }

  public addCallbackToExecuteAfterConnect(
    callback: (...args: any[]) => void,
    callbackArgs: any[] = [],
  ) {
    const observable = this._isConnected.pipe(takeWhile((isConnected) => !isConnected, true))
    observable.subscribe((isConnected) => {
      if (isConnected) {
        callback(...callbackArgs)
      }
    })
  }

  private _fetchChannelByIds(
    userIds: string[],
    resolve: (channel: SendBird.GroupChannel) => void,
    reject: () => void,
  ) {
    const params = new this._sb.GroupChannelParams()
    params.addUserIds(userIds)
    params.isDistinct = true
    this._sb.GroupChannel.createChannel(params, (channel, error) => {
      if (error) {
        console.log(chatErrors.CHAT_CHANNEL_CREATE_FAILED, strigifySendbirdMessage(error))
        return reject()
      }
      if (!this._channels.find((c) => c.url === channel.url)) {
        this._channels.push(channel)
      }
      return resolve(channel)
    })
  }

  public fetchChannelByIds(userIds: string[]) {
    return new Promise((resolve: (channel: SendBird.GroupChannel) => void, reject: () => void) => {
      if (this._isConnected.value) {
        this._fetchChannelByIds(userIds, resolve, reject)
      } else {
        this.addCallbackToExecuteAfterConnect(this._fetchChannelByIds.bind(this), [
          userIds,
          resolve,
          reject,
        ])
      }
    })
  }

  private _fetchChannelByUrl(
    channelUrl: string,
    isBroadcast: boolean,
    resolve: (channel: SendBird.GroupChannel) => void,
    reject: () => void,
  ) {
    let localChannel: SendBird.GroupChannel | null
    const c = this.getChannelLocally(channelUrl)
    if (c) {
      resolve(c)
    }
    this._sb.GroupChannel.getChannel(channelUrl, async (channel, error) => {
      if (error) {
        const createdChannel = await this._createNewChannelByUrl(channelUrl)
        localChannel = createdChannel
      } else {
        localChannel = channel
      }

      if (localChannel) {
        if (isBroadcast) {
          // Hide the channel so it doesn't appear in the chat tab conversation list
          this._hideChannel(localChannel)
        }
        if (!this._channels.find((_c) => _c.url === localChannel?.url)) {
          this._channels.push(localChannel)
        }

        resolve(localChannel)
      }
      reject()
    })
  }

  private async _createNewChannelByUrl(url: string): Promise<SendBird.GroupChannel | null> {
    return new Promise((resolve, reject) => {
      const params = new this._sb.GroupChannelParams()
      params.channelUrl = url
      this._sb.GroupChannel.createChannel(params, (createdChannel, createError) => {
        if (createError) {
          console.log(chatErrors.CHAT_CHANNEL_CREATE_FAILED, strigifySendbirdMessage(createError))
          return reject(new Error(createError.message))
        }
        return resolve(createdChannel)
      })
    })
  }

  private _hideChannel(channel: SendBird.GroupChannel) {
    channel.hide(false, false, (response, hideError) => {
      if (hideError) {
        console.log(chatErrors.CHAT_HIDE_CHANNEL_FAILED, strigifySendbirdMessage(hideError))
      }
    })
  }

  public fetchChannelByUrl(channelUrl: string, isBroadcast: boolean) {
    return new Promise((resolve: (channel: SendBird.GroupChannel) => void, reject: () => void) => {
      if (this._isConnected.value) {
        this._fetchChannelByUrl(channelUrl, isBroadcast, resolve, reject)
      } else {
        this.addCallbackToExecuteAfterConnect(this._fetchChannelByUrl.bind(this), [
          channelUrl,
          isBroadcast,
          resolve,
          reject,
        ])
      }
    })
  }

  public fetchUnreadCount = async () => {
    try {
      const count = await this._sb.getTotalUnreadMessageCount([])
      if (this._totalUnreadMessagesCount) {
        this._totalUnreadMessagesCount.next(count)
      }
      return count
    } catch (error) {
      console.log(chatErrors.CHAT_TOTAL_UNREAD_COUNT_FAILED, strigifySendbirdMessage(error))
    }
  }

  public createChannelHandler(handlerId: string, channelHandlerActionMap: ChannelHandlerActionMap) {
    const channelHandler = new this._sb.ChannelHandler()
    const channelHandlerMapProps = Object.getOwnPropertyNames(channelHandlerActionMap)
    channelHandlerMapProps.forEach((key) => {
      // @ts-ignore
      channelHandler[key] = channelHandlerActionMap[key]
    })
    this._sb.addChannelHandler(handlerId, channelHandler)
  }

  public removeChannelHandler(handlerId: string) {
    this._sb.removeChannelHandler(handlerId)
  }

  public async disconnectUser() {
    if (!this._isConnected) {
      return
    }
    this._sb.setBackgroundState()
    this._sb.disconnect(() => {
      this._isConnected.next(false)
    })
  }

  public clearData() {
    this._onTotalUnreadMessageCountUpdated(0)
    this._sendbirdUser = undefined
    this._channels = []
  }

  public checkIfPushNotificationIsChat(notification: FirebaseMessagingTypes.RemoteMessage) {
    return Platform.OS === 'android'
      ? !!notification.payload?.data?.sendbird
      : !!notification.payload?.sendbird
  }

  public resolveChatPushNotification(payload: any) {
    const sbData = Platform.OS === 'android' ? JSON.parse(payload.data.sendbird) : payload.sendbird
    let route = 'ChatList'
    if (sbData.channel && sbData.channel.channel_url) {
      route = 'Chat'
      const params = {
        participant: undefined,
        channel: undefined,
        channelUrl: sbData.channel.channel_url,
      }
      return [route, params]
    }
    return [route, null]
  }

  private handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (this._appState?.match(/inactive|background/) && nextAppState === 'active') {
      await this.connectUser()
    } else if (nextAppState === 'background') {
      this.disconnectUser()
    }
    this._appState = nextAppState
  }
}

export const ChatServiceId = Symbol('ChatService')
