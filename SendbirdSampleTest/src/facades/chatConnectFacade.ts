import { useRef, useEffect, useState } from 'react'
import { AppStateStatus, AppState } from 'react-native'
import { Subscription } from 'rxjs'

import { IChatService, ChatServiceId } from '~/services/chatService'
import { useInjection } from '~/services/serviceProvider'
import { ISyncManagerService, SyncManagerServiceId } from '~/services/syncManagerService'
import { ChannelHandlerActionMap } from '~/types/actionHandlerMap'

import { onEmit } from './helpersFacade'

export const useSetChatUserDataAndConnect = () => {
  const service = useRef(useInjection<IChatService>(ChatServiceId)).current

  const getChatUserDataAndConnect = async () => service.setupConnectAndCreateAppStateListener()

  // Using bound function to preserve the proper scope
  const registerPushTokenBound = (token: string) => {
    service.registerPushToken(token)
  }

  const registerPushToken = (token: string) => {
    if (service.isConnected) {
      registerPushTokenBound(token)
    } else {
      service.addCallbackToExecuteAfterConnect(registerPushTokenBound, [token])
    }
  }

  return { getChatUserDataAndConnect, registerPushToken }
}

export const useChatDisconnectAndClear = () => {
  const chatService = useRef(useInjection<IChatService>(ChatServiceId)).current
  const syncService = useRef(useInjection<ISyncManagerService>(SyncManagerServiceId)).current
  // const notificationService = useRef(
  //   useInjection<INotificationService>(NotificationServiceId),
  // ).current

  const disconnectAndClear = async () => {
    // try {
    //   const token = await notificationService.getNotificationsTokenByPlatform()
    //   if (token) {
    //     await chatService.unregisterPushToken(token)
    //   }
    // } catch (error) {
    //   console.log(error)
    // }
    syncService.pauseSync()
    syncService.reset()
    chatService.disconnectUser()
    chatService.clearData()
  }

  return { disconnectAndClear }
}

export const useChannelHandler = () => {
  const service = useRef(useInjection<IChatService>(ChatServiceId)).current
  const userIdRef = useRef('')

  const createChannelHandler = (
    handlerId: string,
    channelHandlerActionMap: ChannelHandlerActionMap,
  ) => {
    service.createChannelHandler(handlerId, channelHandlerActionMap)
  }

  const removeChannelHandler = (handlerId: string) => {
    service.removeChannelHandler(handlerId)
  }

  const setupChannelHandler = (
    userId: string,
    onChannelUpdate: (updatedChannel: SendBird.GroupChannel) => void,
  ) => {
    const channelHandlerActionMap: ChannelHandlerActionMap = {
      // @ts-ignore
      onMessageReceived: onChannelUpdate,
      // @ts-ignore
      onMessageUpdated: onChannelUpdate,
      // @ts-ignore
      onMessageDeleted: onChannelUpdate,
      // @ts-ignore
      onChannelChanged: onChannelUpdate,
    }

    createChannelHandler(userId, channelHandlerActionMap)
    userIdRef.current = userId
  }

  useEffect(() => {
    return () => {
      if (userIdRef.current) {
        removeChannelHandler(userIdRef.current)
      }
    }
  }, [])

  return { setupChannelHandler }
}

export const useTotalUnreadMessageCountProvider = () => {
  const service = useRef(useInjection<IChatService>(ChatServiceId)).current

  const [unreadCount, setUnreadCount] = useState(0)
  const currentAppState = useRef('active')

  const fetchUnreadCount = async () => {
    return service.fetchUnreadCount()
  }

  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (currentAppState.current.match(/inactive|background/) && nextAppState === 'active') {
      if (service.isConnected) {
        fetchUnreadCount()
      } else {
        service.addCallbackToExecuteAfterConnect(fetchUnreadCount)
      }
    }
    currentAppState.current = nextAppState
  }

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange)
    const subscriptions: Subscription[] = [
      onEmit<number>(service.totalUnreadMessagesCount, (c) => setUnreadCount(c)),
    ]
    return () => {
      subscriptions.forEach((it) => it.unsubscribe())
      AppState.removeEventListener('change', handleAppStateChange)
    }
  }, [])

  return { fetchUnreadCount, unreadCount }
}
