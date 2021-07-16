import SendBird from 'sendbird'

export function findMessageIndex(
  newMessage: SendBird.UserMessage | SendBird.FileMessage | SendBird.AdminMessage,
  messages: Array<SendBird.UserMessage | SendBird.FileMessage | SendBird.AdminMessage>,
  isRequestId = false,
) {
  let index = messages.length
  for (let i = 0; i < messages.length; i++) {
    if (
      !isRequestId &&
      newMessage.messageId !== 0 &&
      messages[i].messageId !== 0 &&
      messages[i].messageId === newMessage.messageId
    ) {
      index = i
      break
    } else if (isRequestId && messages[i].reqId === newMessage.reqId) {
      index = i
      break
    } else if (messages[i].createdAt < newMessage.createdAt) {
      index = i
      break
    }
  }
  return index
}
