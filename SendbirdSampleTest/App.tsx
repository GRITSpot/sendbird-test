/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react'

import RootNavigator from '~/navigation/RootNavigator'
import { StatusBar } from 'react-native'

const App = () => {
  return (
    <>
      <StatusBar backgroundColor='transparent' barStyle='dark-content' />
      <RootNavigator />
    </>
  )
}

export default App
