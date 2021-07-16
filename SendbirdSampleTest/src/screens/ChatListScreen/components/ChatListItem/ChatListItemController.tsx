import React, { useEffect, useState } from 'react'
import env from 'react-native-config'

import ChatListItemView from './ChatListItemView'
import { ChatMemberUserData } from '~/types/user'
import { prettifyChatMessageDate } from '~/helpers/prettifyDate'
import getParsedChatMemberUser from '~/helpers/getParsedChatUserMember'

type Props = {
  channel: SendBird.GroupChannel
  onChatPress: (channel: SendBird.GroupChannel) => void
}

const ChatListItemController: React.FC<Props> = (props: Props) => {
  const [otherParticipant, setOtherParticipant] = useState<ChatMemberUserData>()

  const onPress = () => {
    props.onChatPress(props.channel)
  }

  const [lastMessageDate, setLastMessageDate] = useState(
    props.channel.lastMessage ? prettifyChatMessageDate(props.channel.lastMessage.createdAt) : '',
  )

  const [lastMessageText, setLastMessageText] = useState('')

  useEffect(() => {
    const participant = props.channel.members.find(
      (m) => m.userId !== env.SENDBIRD_USER_ID && m.role !== 'operator',
    )

    if (participant) {
      setOtherParticipant(getParsedChatMemberUser(participant))
    }
  }, [props.channel])

  useEffect(() => {
    let lastMessage = ''

    if (props.channel.lastMessage) {
      if (props.channel.lastMessage.isUserMessage()) {
        lastMessage =
          (props.channel.lastMessage as SendBird.UserMessage).sender.userId === env.SENDBIRD_USER_ID
            ? `${'ChatListItem_you_prefix'} ${
                (props.channel.lastMessage as SendBird.UserMessage).message
              }`
            : (props.channel.lastMessage as SendBird.UserMessage).message
      } else if (props.channel.lastMessage.isAdminMessage()) {
        lastMessage = (props.channel.lastMessage as SendBird.AdminMessage).message
      }
    }
    setLastMessageText(lastMessage)

    setLastMessageDate(
      props.channel.lastMessage ? prettifyChatMessageDate(props.channel.lastMessage.createdAt) : '',
    )
  }, [props.channel.lastMessage])

  return (
    <ChatListItemView
      onPress={onPress}
      otherParticipant={otherParticipant}
      lastMessageDate={lastMessageDate}
      lastMessageText={lastMessageText}
      unreadMessageCount={props.channel.unreadMessageCount}
    />
  )
}

export default ChatListItemController
