import { useRef, useEffect, useState } from 'react'
import { AppStateStatus, AppState } from 'react-native'

import { findChannelIndex } from '~/helpers/findChannelIndex'
import { getChannelIndex } from '~/helpers/getChannelIndex'
import { IChatService, ChatServiceId } from '~/services/chatService'
import { useInjection } from '~/services/serviceProvider'
import { ISyncManagerService, SyncManagerServiceId } from '~/services/syncManagerService'
import { ActionType } from '~/types/actionHandlerMap'

export const useChatListProvider = () => {
  const chatService = useRef(useInjection<IChatService>(ChatServiceId)).current
  const syncService = useRef(useInjection<ISyncManagerService>(SyncManagerServiceId)).current

  const channelCollection = useRef<any>()

  const channelsRef = useRef<SendBird.GroupChannel[]>([])

  const [channels, setChannels] = useState<SendBird.GroupChannel[]>([])
  const fetchIsInProgress = useRef(false)
  const [isLoading, setIsLoading] = useState(false)
  const currentAppState = useRef('active')

  const fetchNext = async () => {
    if (channelCollection.current && !fetchIsInProgress.current) {
      fetchIsInProgress.current = true
      await channelCollection.current.fetch()
      fetchIsInProgress.current = false
    }
  }

  const prepare = async () => {
    setIsLoading(true)
    channelsRef.current = []
    if (channelCollection.current) {
      channelCollection.current.remove()
    }
    const addChannels = (newChannels: SendBird.GroupChannel[]) => {
      const n = [...channelsRef.current]
      for (const channel of newChannels) {
        const index = findChannelIndex(channel, n)
        if (index >= 0) {
          n.splice(index, 0, channel)
        }
      }
      channelsRef.current = n
      setChannels(n)
    }

    const updateChannels = (updatedChannels: SendBird.GroupChannel[]) => {
      const n = [...channelsRef.current]
      for (const channel of updatedChannels) {
        const index = getChannelIndex(channel, n)
        if (index >= 0) {
          n[index] = channel
        }
      }
      channelsRef.current = n
      setChannels(n)
    }

    const removeChannels = (channelsToRemove: SendBird.GroupChannel[]) => {
      const n = [...channelsRef.current]
      for (const channel of channelsToRemove) {
        const index = getChannelIndex(channel, n)
        if (index >= 0) {
          n.splice(index, 1)
        }
      }
      channelsRef.current = n
      setChannels(n)
    }

    const moveChannels = (channelsToMove: SendBird.GroupChannel[]) => {
      const n = [...channelsRef.current]
      for (const channel of channelsToMove) {
        const from = getChannelIndex(channel, n)
        if (from >= 0) {
          n.splice(from, 1)
        }
        const to = findChannelIndex(channel, n)
        n.splice(to, 0, channel)
      }
      channelsRef.current = n
      setChannels(n)
    }

    const clearChannels = () => {
      setChannels([])
    }

    const handlers = {
      [ActionType.INSERT]: addChannels,
      [ActionType.UPDATE]: updateChannels,
      [ActionType.REMOVE]: removeChannels,
      [ActionType.CLEAR]: clearChannels,
      [ActionType.MOVE]: moveChannels,
    }

    channelCollection.current = await syncService.createChannelCollection(handlers)
    await fetchNext()
    setIsLoading(false)
  }

  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (currentAppState.current.match(/inactive|background/) && nextAppState === 'active') {
      if (chatService.isConnected) {
        prepare()
      } else {
        chatService.addCallbackToExecuteAfterConnect(prepare)
      }
    }
    currentAppState.current = nextAppState
  }

  useEffect(() => {
    prepare()
    AppState.addEventListener('change', handleAppStateChange)

    return () => {
      AppState.removeEventListener('change', handleAppStateChange)
      channelCollection.current.remove()
      channelsRef.current = []
    }
  }, [])

  return { fetchNext, channels, isLoading }
}
