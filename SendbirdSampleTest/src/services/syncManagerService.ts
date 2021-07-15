import AsyncStorage from '@react-native-community/async-storage'
import { inject, injectable } from 'inversify'
import SendBird from 'sendbird'
import SendBirdSyncManager from 'sendbird-syncmanager'

import { ActionHandlerMap } from '~/types/actionHandlerMap'
import chatErrors from '~/const/chatErrors'
import handleError from './errorHandler'
import { ISessionService, SessionServiceId } from './session'
import { AppState, AppStateStatus } from 'react-native'

export interface ISyncManagerService {
  init: (sb: SendBird.SendBirdInstance) => Promise<void>
  setupSyncManager: () => void
  setupConnectionHandler: () => void
  createChannelCollection: (
    handlers: ActionHandlerMap,
  ) => // @ts-expect-error
  Promise<SendBirdSyncManager.ChannelCollection>
  getExistingChannelsForCoach: (
    userIds: Array<string>,
  ) => // @ts-expect-error
  Promise<SendBirdSyncManager.Channel>
  createMessageCollection: (
    channel: SendBird.GroupChannel,
    handlers: ActionHandlerMap,
  ) => // @ts-expect-error
  Promise<SendBirdSyncManager.MessageCollection>
  resumeSync: () => void
  pauseSync: () => void
  reset: () => void
}

@injectable()
export class SyncManagerService implements ISyncManagerService {
  private _appState: AppStateStatus = 'active'

  constructor(@inject(SessionServiceId) private readonly _sessionService: ISessionService) {}

  public init = async (sb: SendBird.SendBirdInstance) => {
    // SendBirdSyncManager.loggerLevel = 98765
    //@ts-expect-error
    SendBirdSyncManager.sendBird = sb
    SendBirdSyncManager.useReactNative(AsyncStorage)
  }

  public setupSyncManager = async () => {
    try {
      const options = new SendBirdSyncManager.Options()
      options.messageCollectionCapacity = 2000
      // @ts-expect-error
      options.messageResendPolicy = 'automatic'
      options.failedMessageRetentionDays = 7
      options.maxFailedMessageCountPerChannel = 50
      options.automaticMessageResendRetryCount = 4

      SendBirdSyncManager.setup(this._sessionService.userId!, options)
    } catch (e) {
      handleError(chatErrors.CHAT_USER_UPDATE_FAILED, e)
    }
  }

  public setupConnectionHandler() {
    const connectionHandler = new SendBirdSyncManager.sendBird.ConnectionHandler()
    connectionHandler.onReconnectFailed = () => {
      SendBirdSyncManager.sendBird.reconnect()
    }
    connectionHandler.onReconnectStarted = () => {
      SendBirdSyncManager.getInstance()?.pauseSync()
    }
    connectionHandler.onReconnectSucceeded = () => {
      SendBirdSyncManager.getInstance()?.resumeSync()
    }
    SendBirdSyncManager.sendBird.addConnectionHandler('connection handler', connectionHandler)

    AppState.addEventListener('change', this.handleAppStateChange)
  }

  public async createChannelCollection(handlers: ActionHandlerMap) {
    const query = SendBirdSyncManager.sendBird.GroupChannel.createMyGroupChannelListQuery()
    query.limit = 50
    query.includeEmpty = false
    query.order = 'latest_last_message'

    const collection = new SendBirdSyncManager.ChannelCollection(query)
    const collectionHandler = new SendBirdSyncManager.ChannelCollection.CollectionHandler()
    collectionHandler.onChannelEvent = (action, channels) => {
      if (handlers[action]) {
        handlers[action](channels)
      }
    }
    collection.setCollectionHandler(collectionHandler)
    return collection
  }

  public async getExistingChannelsForCoach(userIds: Array<string>) {
    return new Promise((resolve, reject) => {
      const query = SendBirdSyncManager.sendBird.GroupChannel.createMyGroupChannelListQuery()
      query.limit = 50
      query.includeEmpty = false
      query.userIdsExactFilter = userIds
      query.next((groupChannels: SendBird.GroupChannel[], error: any) => {
        if (error) {
          reject(error)
        }
        resolve(groupChannels)
      })
    })
  }

  public createMessageCollection = async (
    channel: SendBird.GroupChannel,
    handlers: ActionHandlerMap,
  ) => {
    const filters = {}
    const viewpointTimestamp = Date.now()
    const collection = new SendBirdSyncManager.MessageCollection(
      // @ts-expect-error
      channel,
      //@ts-ignore
      filters,
      viewpointTimestamp,
    )
    const handler = new SendBirdSyncManager.MessageCollection.CollectionHandler()
    handler.onMessageEvent = (action, messages) => {
      if (handlers[action]) {
        handlers[action](messages)
      }
    }
    collection.setCollectionHandler(handler)
    return collection
  }

  public resumeSync() {
    SendBirdSyncManager.getInstance()?.resumeSync()
  }

  public pauseSync() {
    SendBirdSyncManager.getInstance()?.pauseSync()
  }

  public async reset() {
    try {
      await SendBirdSyncManager.getInstance().reset()
    } catch (e) {
      handleError(chatErrors.SYNC_MANAGER_RESET_FAILED, e)
    }
  }

  private handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (nextAppState.match(/inactive|background/) && this._appState === 'active') {
      this.pauseSync()
    } else if (nextAppState === 'active') {
      this.resumeSync()
    }

    this._appState = nextAppState
  }
}

export const SyncManagerServiceId = Symbol('SyncManagerService')
