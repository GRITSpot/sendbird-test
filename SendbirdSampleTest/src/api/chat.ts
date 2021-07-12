import apiClient from './client/apiClient'

export const getOrCreateChatUsers = async (userIds: string[], token: string) => {
  return apiClient('/chat/users', {
    method: 'post',
    data: {
      user_ids: userIds,
    },
    token,
  })
}

export const sendEventBroadcastMessage = async (
  eventdId: string,
  message: string,
  token: string,
) => {
  return apiClient('/chat/broadcast/event', {
    method: 'post',
    data: {
      event_id: eventdId,
      message,
    },
    token,
  })
}
