/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useEffect, useState } from 'react'
import { i18n } from 'i18next'

import initI18n from '~/i18n'
import RootNavigator from '~/navigation/RootNavigator'
import { StatusBar } from 'react-native'
import { I18nextProvider } from 'react-i18next'

const App = () => {
  const [localI18n, setLocalI18n] = useState<i18n | null>(null)
  const [translationIsLoaded, setTranslationIsLoaded] = useState(false)

  const setupI18n = async () => {
    const result = await initI18n(() => setTranslationIsLoaded(true))
    setLocalI18n(result)
  }

  useEffect(() => {
    setupI18n()
  }, [])

  return (
    !!localI18n && (
      <I18nextProvider i18n={localI18n}>
        <StatusBar backgroundColor='transparent' barStyle='dark-content' />
        {translationIsLoaded && <RootNavigator />}
      </I18nextProvider>
    )
  )
}

export default App
