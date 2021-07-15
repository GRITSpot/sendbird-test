import { useRef } from 'react'

import { useInjection } from '~/services/serviceProvider'
import { ChatServiceId, IChatService } from '~/services/chatService'
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging'

export const useChatPushNotificationHandlers = () => {
  const chatService = useRef(useInjection<IChatService>(ChatServiceId)).current

  const checkIfPushNotificationIsChat = (notification: FirebaseMessagingTypes.RemoteMessage) => {
    return chatService.checkIfPushNotificationIsChat(notification)
  }

  const resolveChatPushNotification = (data: any) => {
    return chatService.resolveChatPushNotification(data)
  }

  return { checkIfPushNotificationIsChat, resolveChatPushNotification }
}
