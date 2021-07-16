import React from 'react'
import { SafeAreaView, View, Text, StyleSheet, LayoutChangeEvent } from 'react-native'

import Burpees from '~/burpees'
import { scale } from '~/helpers/scaling'

type Props = {
  title?: string
  leftElement?: JSX.Element | null
  rightElement?: JSX.Element
  hasShadow?: boolean
  onLayout?: (event: LayoutChangeEvent) => void
}

export const HEADER_HEIGHT = 56

const Header: React.FC<Props> = ({ title, leftElement, rightElement, hasShadow, onLayout }) => {
  return (
    <SafeAreaView style={[styles.root, hasShadow && styles.shadow]}>
      <View style={styles.container} onLayout={onLayout}>
        {!!leftElement && leftElement}
        {!!title && <Text style={styles.header}>{title}</Text>}
        {!!rightElement && rightElement}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: Burpees.Colors.greyScale.white,
  },
  shadow: {
    shadowColor: Burpees.Colors.greyScale.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: HEADER_HEIGHT,
    width: '100%',
    paddingVertical: scale(15),
  },
  header: {
    paddingLeft: scale(24),
    ...Burpees.Typography.H3,
    color: Burpees.Colors.greyScale.black,
  },
})

export default Header
