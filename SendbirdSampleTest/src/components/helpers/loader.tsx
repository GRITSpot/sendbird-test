import * as React from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'

import Burpees from '~/burpees'

export default function Loader(props: { style?: any }) {
  const { style = {} } = props
  return (
    <View style={[styles.root, style]}>
      <ActivityIndicator color={Burpees.Colors.brand.beat71} size='large' />
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
