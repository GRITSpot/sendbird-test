import * as React from 'react'
import { View, Text, StyleSheet, SafeAreaView, ViewStyle } from 'react-native'

import { scale } from '~/helpers/scaling'
import COLORS from '~/styles/colors'
import SHADOWS from '~/styles/shadows'
import TYPOGRAPHY from '~/styles/typography'

interface Props {
  title?: string
  hasShadow?: boolean
  centerElement?: any
  leftElement?: Element
  rightElement?: Element
  children?: any
  containerStyle?: ViewStyle
  customContent?: Element
}

const ScreenHeader = ({ hasShadow = true, ...props }: Props) => (
  // @ts-expect-error
  <SafeAreaView style={[styles.headerContainer(hasShadow), props.containerStyle]}>
    {props.customContent ? (
      <View style={styles.contentContainer}>{props.customContent}</View>
    ) : (
      <View style={styles.contentContainer}>
        <View style={styles.headerElements}>{!!props.leftElement && props.leftElement}</View>
        <View style={styles.centerElement}>
          {!!props.centerElement && props.centerElement}
          {!!props.title && <Text style={styles.headerTitle}>{props.title}</Text>}
        </View>
        <View style={styles.headerElements}>{!!props.rightElement && props.rightElement}</View>
      </View>
    )}
    {props.children}
  </SafeAreaView>
)

const styles = StyleSheet.create({
  // @ts-expect-error
  headerContainer: (hasShadow: boolean) => ({
    width: '100%',
    position: 'relative',
    backgroundColor: COLORS.greyscale.white,
    zIndex: 999,
    ...(hasShadow && SHADOWS.navigation),
  }),
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: scale(16),
    width: '100%',
  },
  centerElement: {
    flexGrow: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerElements: {
    flex: 1,
  },
  headerTitle: {
    ...TYPOGRAPHY.h2Header,
    textAlign: 'center',
  },
})

export default ScreenHeader
