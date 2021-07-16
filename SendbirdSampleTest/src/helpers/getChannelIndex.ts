import SendBird from 'sendbird'

export function getChannelIndex(
  newChannel: SendBird.GroupChannel,
  channels: SendBird.GroupChannel[],
) {
  for (let i = 0; i < channels.length; i++) {
    if (channels[i].url === newChannel.url) {
      return i
    }
  }
  return -1
}
