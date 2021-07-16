import uniqBy from 'lodash/uniqBy'
import React from 'react'
import { NavigationStackScreenProps } from 'react-navigation-stack'

import { useChatListProvider } from '~/facades/chatListFacade'

import ChatListView from './ChatListView'

const ChatListController: React.FC<NavigationStackScreenProps> = (props) => {
  const { fetchNext, channels, isLoading } = useChatListProvider()

  const navigateToChat = (channel: SendBird.GroupChannel) => {
    props.navigation.navigate('Chat', { channel })
  }

  const filteredChannels = uniqBy(
    channels.filter((c) => c.memberCount > 1),
    (c) => c.url,
  )

  return (
    <ChatListView
      channels={filteredChannels}
      isLoading={isLoading}
      onChatPress={navigateToChat}
      fetchNext={fetchNext}
      onReviewParticipantsButtonPress={() => undefined}
      onUpcomingParticipantsButtonPress={() => undefined}
      onBookWorkoutButtonPress={() => undefined}
    />
  )
}

export default ChatListController
