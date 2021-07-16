import { checkIfUserIsNew } from './checkIfUserIsNew'

const getParsedChatMemberUser = (user: SendBird.Member): any => {
  let isNew = false
  if (user.metaData.hasOwnProperty('created_at')) {
    isNew = checkIfUserIsNew((user.metaData as any).created_at)
  }

  const coachFirstName = user.nickname.trim().split(' ')[0]

  return {
    id: user.userId,
    nickname: user.nickname,
    coachFirstName,
    profilePicture: user.profileUrl,
    isNew,
  }
}

export default getParsedChatMemberUser
