import React, { PropsWithChildren } from 'react'
import { Text, View, StyleSheet, ViewStyle } from 'react-native'
import FastImage from 'react-native-fast-image'

import { scale } from '~/helpers/scaling'
import COLORS from '~/styles/colors'
import TYPOGRAPHY from '~/styles/typography'

type Props = {
  emojiSource: any
  title: string
  description: string
  containerCustomStyles?: ViewStyle
}

const EmptyScreen = (props: PropsWithChildren<Props>) => (
  <View style={[styles.emptyContainer, props.containerCustomStyles]}>
    <FastImage source={props.emojiSource} style={styles.emptyStateImage} />
    <Text style={styles.emptyTitle}>{props.title}</Text>
    <Text style={styles.emptyDescription}>{props.description}</Text>
    {props.children}
  </View>
)

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    backgroundColor: COLORS.greyscale.light,
    paddingTop: scale(64),
    paddingBottom: scale(32),
    alignItems: 'center',
  },
  emptyStateImage: {
    width: scale(48),
    height: scale(48),
  },
  emptyTitle: {
    ...TYPOGRAPHY.h3Header,
    marginVertical: scale(16),
    textAlign: 'center',
  },
  emptyDescription: {
    ...TYPOGRAPHY.bodyText2,
    textAlign: 'center',
  },
})

export default EmptyScreen
