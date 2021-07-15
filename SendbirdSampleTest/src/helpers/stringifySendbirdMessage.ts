import SendBird from 'sendbird'

export const strigifySendbirdMessage = (error: SendBird.SendBirdError) => {
  return `CODE: ${error.code} MESSAGE: ${error.message}`
}
