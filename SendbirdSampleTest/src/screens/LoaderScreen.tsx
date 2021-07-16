import React, { useEffect } from 'react'
import { Text, View } from 'react-native'
import { NavigationStackScreenProps } from 'react-navigation-stack'

import { useSetChatUserDataAndConnect } from '~/facades/chatConnectFacade'

const LoaderScreenController: React.FC<NavigationStackScreenProps> = (props) => {
  const { getChatUserDataAndConnect, registerPushToken } = useSetChatUserDataAndConnect()

  useEffect(() => {
    setTimeout(() => {
      loadData()
    }, 10)
  }, [])

  //TODO: Refactor this
  const loadData = async () => {
    await getChatUserDataAndConnect()

    props.navigation.navigate('ChatStack')
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>LOADING!</Text>
    </View>
  )
}

export default LoaderScreenController
