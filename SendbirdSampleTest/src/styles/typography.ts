import { StyleSheet } from 'react-native'
import { scale } from '~/helpers/scaling'
import COLORS from './colors'

const TYPOGRAPHY = StyleSheet.create({
  h1Header: {
    color: COLORS.greyscale.almostBlack,
    fontWeight: '700',
    fontSize: scale(24),
    lineHeight: scale(29),
    textTransform: 'uppercase',
  },
  h2Header: {
    color: COLORS.greyscale.almostBlack,
    fontWeight: '600',
    fontSize: scale(18),
    lineHeight: scale(22),
    textTransform: 'uppercase',
  },
  h3Header: {
    color: COLORS.greyscale.almostBlack,
    fontWeight: '600',
    fontSize: scale(15),
    lineHeight: scale(18),
  },
  subtitle: {
    color: COLORS.greyscale.almostBlack,
    fontWeight: '600',
    fontSize: scale(13),
    lineHeight: scale(16),
  },
  bodyText1: {
    color: COLORS.greyscale.almostBlack,
    fontSize: scale(15),
    lineHeight: scale(24),
  },
  bodyText2: {
    color: COLORS.greyscale.almostBlack,
    fontSize: scale(13),
    lineHeight: scale(21),
  },
  caption: {
    color: COLORS.greyscale.almostBlack,
    fontSize: scale(11),
    lineHeight: scale(14),
  },
  label: {
    color: COLORS.greyscale.almostBlack,
    fontWeight: '600',
    fontSize: scale(10),
    lineHeight: scale(14),
    textTransform: 'uppercase',
  },
})

export default TYPOGRAPHY
