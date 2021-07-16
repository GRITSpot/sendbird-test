import React from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'

import WarningIcon from '~/assets/icons/warning'

import { scale } from '~/helpers/scaling'
import COLORS from '~/styles/colors'

interface Props {
  icon?: React.ReactElement
  text: string
  backgroundColor?: string
  textColor?: string
  iconColor?: string
  customContainerStyle?: ViewStyle
}

const AlertBox = (props: Props) => {
  return (
    // @ts-ignore
    <View style={[styles.container(props.backgroundColor), props.customContainerStyle]}>
      <View style={styles.iconContainer}>
        {props.icon ?? <WarningIcon color={props.iconColor || COLORS.greyscale.white} />}
      </View>
      {/* @ts-ignore */}
      <Text style={styles.text(props.textColor)}>{props.text}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  // @ts-ignore
  container: (bgColor: string) => ({
    backgroundColor: bgColor || COLORS.uiSpecific.alert,
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: scale(16),
    borderRadius: 8,
  }),
  // @ts-ignore
  text: (textColor: string) => ({
    color: textColor || COLORS.greyscale.white,
    fontSize: scale(13),
    lineHeight: scale(21),
    marginLeft: scale(10),
    flexWrap: 'wrap',
    marginRight: scale(16),
  }),
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scale(4),
  },
})

export default AlertBox
