import SendBird from 'sendbird'

export function getMessageIndex(
  newMessage: SendBird.UserMessage | SendBird.FileMessage | SendBird.AdminMessage,
  messages: Array<SendBird.UserMessage | SendBird.FileMessage | SendBird.AdminMessage>,
) {
  for (let i = 0; i < messages.length; i++) {
    if (newMessage.isIdentical(messages[i])) {
      return i
    }
  }
  return -1
}
