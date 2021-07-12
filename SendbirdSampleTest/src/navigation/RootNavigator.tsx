import React from 'react'
import createAnimatedSwitchNavigator from 'react-navigation-animated-switch'
import { Transition } from 'react-native-reanimated'
import { createAppContainer } from 'react-navigation'
import LoaderScreen from '~/screens/LoaderScreen'
import PlaceholderScreen from '~/screens/PlaceholderScreen'

export default createAppContainer(
  createAnimatedSwitchNavigator(
    {
      LoaderScreen,
      PlaceholderScreen,
    },
    {
      initialRouteName: 'LoaderScreen',
      transition: (
        <Transition.Together>
          <Transition.Out type='slide-left' durationMs={400} interpolation='easeIn' />
          <Transition.In type='slide-right' durationMs={400} interpolation='easeIn' />
        </Transition.Together>
      ),
    },
  ),
)
