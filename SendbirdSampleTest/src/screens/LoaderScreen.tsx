import React, { useEffect } from 'react'
import { Text, View } from 'react-native'
import { NavigationStackScreenProps } from 'react-navigation-stack'
import SendBird from 'sendbird'

import { getOrCreateChatUsers } from '~/api/chat'

const LoaderScreenController: React.FC<NavigationStackScreenProps> = (props) => {
  useEffect(() => {
    setTimeout(() => {
      loadData()
    }, 10)
  }, [])

  //TODO: Refactor this
  const loadData = async () => {
    // gets only first page of all endpoints responses except trainers(all are downloaded here)
    try {
      // ########### SENDBIRD ###########
      // await setupSyncManager(user)
      const userId = ''
      const token = ''
      let _sbToken = ''
      try {
        const { data }: any = await getOrCreateChatUsers([userId], token)
        const loggedUser = data.find((chatUser: any) => !!chatUser.access_token)
        _sbToken = loggedUser?.access_token || ''
        console.log('🚀 ~ file: LoaderScreen.tsx ~ line 29 ~ loadData ~ _sbToken', _sbToken)
      } catch (e) {
        console.log(e)
      }

      const _sb = new SendBird({ appId: '' })
      try {
        const _sendbirdUser = await _sb.connect(userId, _sbToken)
        console.log(
          '🚀 ~ file: LoaderScreenController.tsx ~ line 147 ~ loadData ~ _sendbirdUser',
          _sendbirdUser,
        )
        _sb.setForegroundState()
      } catch (e) {
        console.log(e)
      }
      await new Promise((resolve) => {
        setTimeout(resolve, 500)
      })
      props.navigation.navigate('PlaceholderScreen')
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>LOADING!</Text>
    </View>
  )
}

export default LoaderScreenController
