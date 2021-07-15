export type ChatUser = {
  user_id: string
  nickname: string
  access_token: string
  active: boolean
  profile_url: string
  metadata: {
    user_type: string
  }
}

export type ChatUsersResponse = {
  data: ChatUser[]
}
