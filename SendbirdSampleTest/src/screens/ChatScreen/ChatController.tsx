import { sortBy, get } from 'lodash'
import React, { useMemo } from 'react'
import { NavigationStackScreenProps } from 'react-navigation-stack'
import { UserMessage } from 'sendbird'

import { useMessageRelay } from '~/facades/chatMessageRelayFacade'

import ChatView from './ChatView'

type NavigationParams = {
  channel: SendBird.GroupChannel
  channelUrl: string
}

const ChatController: React.FC<NavigationStackScreenProps<NavigationParams>> = (props) => {
  const messageRelayOptions = useMemo(() => {
    const passedChannel = props.navigation.getParam('channel')
    const passedChannelUrl = props.navigation.getParam('channelUrl')

    return {
      passedChannel,
      passedChannelUrl,
    }
  }, [props.navigation])

  const {
    messages,
    participant,
    currentUser,
    isLoading,
    sendMessage,
    resendFailedMessage,
    loadPrevious,
  } = useMessageRelay(messageRelayOptions)

  const onBackPress = () => {
    props.navigation.pop()
  }

  const sendUserMessage = (text: string) => {
    sendMessage({ text })
  }

  return (
    <ChatView
      user={currentUser}
      sendMessage={sendUserMessage}
      // @ts-ignore
      messages={sortBy(messages, (m: UserMessage) => m.createdAt)}
      otherParticipant={participant}
      loadPrevious={loadPrevious}
      // @ts-ignore
      resendFailedMessage={resendFailedMessage}
      onBackPress={onBackPress}
      isLoading={isLoading}
    />
  )
}

export default ChatController
