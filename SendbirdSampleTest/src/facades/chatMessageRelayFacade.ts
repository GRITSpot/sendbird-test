import { useRef, useEffect, useState } from 'react'
import { AppState, AppStateStatus } from 'react-native'
import get from 'lodash/get'

import { useInjection } from '~/services/serviceProvider'
import { IChatService, ChatServiceId } from '~/services/chatService'
import { ISyncManagerService, SyncManagerServiceId } from '~/services/syncManagerService'
import { ActionType } from '~/types/actionHandlerMap'
import { findMessageIndex } from '~/helpers/findMessageIndex'
import { getMessageIndex } from '~/helpers/getMessageIndex'
import getParsedChatMemberUser from '~/helpers/getParsedChatUserMember'

type MessageRelayOptions = {
  isBroadcast?: boolean
  passedChannel?: SendBird.GroupChannel
  passedChannelUrl?: string
}

export const useMessageRelay = (options: MessageRelayOptions) => {
  const chatService = useRef(useInjection<IChatService>(ChatServiceId)).current
  const syncService = useRef(useInjection<ISyncManagerService>(SyncManagerServiceId)).current

  // @ts-ignore
  const messageCollection = useRef<SendBirdSyncManager.MessageCollection>()
  const channel = useRef<SendBird.GroupChannel>()
  const messagesRef = useRef<
    Array<SendBird.UserMessage | SendBird.FileMessage | SendBird.AdminMessage>
  >([])

  const [messages, setMessages] = useState<
    Array<SendBird.UserMessage | SendBird.FileMessage | SendBird.AdminMessage>
  >([])
  const [isLoading, setIsLoading] = useState(true)
  const [participant, setParticipant] = useState<any | null>(null)
  const [currentUser, setCurrentUser] = useState<any | null>(null)
  const fetchIsInProgress = useRef(false)
  const currentAppState = useRef('active')

  const fetch = async (direction: 'prev' | 'next') => {
    try {
      await messageCollection.current?.fetchSucceededMessages(direction)
    } catch (e) {
      console.log(e)
    }
  }

  const fullFetch = async () => {
    if (messageCollection.current && !fetchIsInProgress.current) {
      fetchIsInProgress.current = true
      console.log('-------------------------------------fullFetch')
      await fetch('prev')
      await fetch('next')
      await messageCollection.current?.fetchFailedMessages()
      console.log('-------------------------------------fullFetch-FINISH')
      fetchIsInProgress.current = false
    }
  }

  const prepare = async () => {
    setIsLoading(true)

    messagesRef.current = []
    if (messageCollection.current) {
      messageCollection.current.remove()
      messageCollection.current = undefined
    }

    if (options.passedChannel) {
      channel.current = options.passedChannel
    } else if (options.passedChannelUrl) {
      channel.current = await chatService.fetchChannelByUrl(
        options.passedChannelUrl,
        options.isBroadcast || false,
      )
    } else {
      setIsLoading(false)
      return
    }

    const otherParticipant = chatService.getOtherParticipantFromChannel(channel.current)
    if (otherParticipant) {
      setParticipant(getParsedChatMemberUser(otherParticipant))
    }

    const currentUser = chatService.getCurrentUserFromChannel(channel.current)
    if (currentUser) {
      setCurrentUser(getParsedChatMemberUser(currentUser))
    }

    const addMessages = (
      newMessages: Array<SendBird.UserMessage | SendBird.FileMessage | SendBird.AdminMessage>,
    ) => {
      const m = [...messagesRef.current]
      for (const message of newMessages) {
        const isFailed =
          message.messageId === 0 && (message as SendBird.UserMessage).requestState === 'failed'
        const index = findMessageIndex(message, m, isFailed)
        if (index >= 0) {
          m.splice(index, 0, message)
          if (index > 0) {
            // @ts-ignore
            m[index - 1]._isPreviousMessageSentBySameUser =
              // @ts-ignore
              m[index - 1].sender &&
              // @ts-ignore
              m[index].sender &&
              // @ts-ignore
              m[index - 1].sender.userId === m[index].sender.userId
          }
          if (index < m.length - 1) {
            // @ts-ignore
            m[index]._isPreviousMessageSentBySameUser =
              // @ts-ignore
              m[index].sender &&
              // @ts-ignore
              m[index + 1].sender &&
              // @ts-ignore
              m[index].sender.userId === m[index + 1].sender.userId
          }
        }
      }
      messagesRef.current = m
      setMessages(m)
      if (channel.current) {
        channel.current.markAsRead()
      }
    }

    const updateMessages = (
      updatedMessages: Array<SendBird.UserMessage | SendBird.FileMessage | SendBird.AdminMessage>,
    ) => {
      const m = [...messagesRef.current]
      for (const message of updatedMessages) {
        const index = getMessageIndex(message, m)
        if (index >= 0) {
          // @ts-ignore
          message._isPreviousMessageSentBySameUser = m[index]._isPreviousMessageSentBySameUser
          m[index] = message
        }
      }
      messagesRef.current = m
      setMessages(m)
    }

    const removeMessages = (
      messagesToRemove: Array<SendBird.UserMessage | SendBird.FileMessage | SendBird.AdminMessage>,
    ) => {
      const m = [...messagesRef.current]
      for (const message of messagesToRemove) {
        const index = getMessageIndex(message, m)
        if (index >= 0) {
          m.splice(index, 1)
          if (index < m.length - 1) {
            // @ts-ignore
            m[index]._isPreviousMessageSentBySameUser =
              // @ts-ignore
              m[index + 1].sender &&
              // @ts-ignore
              m[index].sender &&
              // @ts-ignore
              m[index + 1].sender.userId === m[index].sender.userId
          }
        }
      }
      messagesRef.current = m
      setMessages(m)
    }

    const clearMessages = () => {
      setMessages([])
    }

    const handlers = {
      [ActionType.INSERT]: addMessages,
      [ActionType.UPDATE]: updateMessages,
      [ActionType.REMOVE]: removeMessages,
      [ActionType.CLEAR]: clearMessages,
      [ActionType.MOVE]: () => {},
    }

    messageCollection.current = await syncService.createMessageCollection(channel.current, handlers)
    channel.current.markAsRead()

    await fullFetch()
    chatService.fetchUnreadCount()
    setIsLoading(false)
  }

  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (currentAppState.current.match(/inactive|background/) && nextAppState === 'active') {
      if (chatService.isConnected) {
        fullFetch()
      } else {
        chatService.addCallbackToExecuteAfterConnect(fullFetch)
      }
    }
    currentAppState.current = nextAppState
  }

  useEffect(() => {
    prepare()
    AppState.addEventListener('change', handleAppStateChange)

    return () => {
      messagesRef.current = []
      AppState.removeEventListener('change', handleAppStateChange)
      if (messageCollection.current) {
        messageCollection.current.remove()
        messageCollection.current = undefined
      }
    }
  }, [options])

  const loadPrevious = async () => {
    if (messageCollection.current && !fetchIsInProgress.current) {
      fetchIsInProgress.current = true
      console.log('++++++++++++++++++++++++++++++++++++loadPrevious')
      await fetch('prev')
      fetchIsInProgress.current = false
      console.log('++++++++++++++++++++++++++++++++++++loadPrevious-FINFISH')
    }
  }

  const sendMessage = ({ text, customType }: { text: string; customType?: string }) => {
    if (!channel.current) {
      return
    }
    const messageParams = chatService.setupMessageParams({ text, customType })
    const pendingMessage = channel.current.sendUserMessage(messageParams, (message, err) => {
      // To preserve order of pending messages being processed before same failed ones.
      setTimeout(() => {
        if (messageCollection.current) {
          messageCollection.current.handleSendMessageResponse(err, message)
        }
      }, 100)
    })
    if (messageCollection.current) {
      messageCollection.current.appendMessage(pendingMessage)
    }
  }

  const resendFailedMessage = (
    message: SendBird.UserMessage | SendBird.FileMessage | SendBird.AdminMessage,
  ) => {
    if (!channel.current) {
      return
    }
    channel.current.resendUserMessage(message as SendBird.UserMessage, (m, err) => {
      if (messageCollection.current) {
        messageCollection.current.handleSendMessageResponse(err, m)
      }
    })
  }

  return {
    messages,
    participant,
    currentUser,
    isLoading,
    sendMessage,
    resendFailedMessage,
    loadPrevious,
  }
}
