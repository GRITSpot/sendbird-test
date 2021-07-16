import SendBird from 'sendbird'

export function findChannelIndex(
  newChannel: SendBird.GroupChannel,
  channels: SendBird.GroupChannel[],
) {
  const newChannelLastMessageUpdated = newChannel.lastMessage
    ? newChannel.lastMessage.createdAt
    : newChannel.createdAt
  let index = channels.length
  for (let i = 0; i < channels.length; i++) {
    const comparedChannel = channels[i]
    const comparedChannelLastMessageUpdated = comparedChannel.lastMessage
      ? comparedChannel.lastMessage.createdAt
      : comparedChannel.createdAt
    if (
      newChannelLastMessageUpdated === comparedChannelLastMessageUpdated &&
      newChannel.url === comparedChannel.url
    ) {
      index = i
      break
    } else if (newChannelLastMessageUpdated > comparedChannelLastMessageUpdated) {
      index = i
      break
    }
  }
  return index
}
