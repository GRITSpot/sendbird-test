import React, { useCallback, useEffect, useState } from 'react'
import { Text, View } from 'react-native'

import App from './App'

const Root = (props: any) => {
  const [storybookActive, setStorybookActive] = useState(false)
  const toggleStorybook = useCallback(() => setStorybookActive((active) => !active), [])

  useEffect(() => {
    if (__DEV__) {
      // eslint-disable-next-line
      const DevMenu = require('react-native-dev-menu')
      DevMenu.addItem('Toggle Storybook', toggleStorybook)
    }
  }, [toggleStorybook])

  return storybookActive ? (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>MOCK-STORYBOOK!</Text>
    </View>
  ) : (
    <App {...props} />
  )
}

export default Root
