import { StyleSheet } from 'react-native'

import { scale } from '~/helpers/scaling'

import Colors from './color'

const Typography = StyleSheet.create({
  H1: {
    fontSize: scale(32),
    lineHeight: scale(48),
    fontWeight: '600',
    color: Colors.greyScale.black,
  },
  H2: {
    fontSize: scale(24),
    lineHeight: scale(32),
    fontWeight: '600',
    color: Colors.greyScale.black,
  },
  H3: {
    fontSize: scale(16),
    lineHeight: scale(24),
    fontWeight: '600',
    color: Colors.greyScale.black,
  },
  H4: {
    fontSize: scale(14),
    lineHeight: scale(22),
    fontWeight: '600',
    color: Colors.greyScale.black,
  },
  BODY_TEXT_XL: {
    fontSize: scale(24),
    lineHeight: scale(32),
    color: Colors.greyScale.black,
  },
  BODY_TEXT_L: {
    fontSize: scale(16),
    lineHeight: scale(24),
    color: Colors.greyScale.black,
  },
  BODY_TEXT_M: {
    fontSize: scale(14),
    lineHeight: scale(22),
    color: Colors.greyScale.black,
  },
  BODY_TEXT_S: {
    fontSize: scale(12),
    lineHeight: scale(22),
    color: Colors.greyScale.black,
  },
  LINK: {
    fontSize: scale(16),
    lineHeight: scale(24),
    fontWeight: '600',
    textDecorationLine: 'underline',
    color: Colors.greyScale.black,
  },
  BUTTON: {
    fontSize: scale(16),
    lineHeight: scale(19),
    fontWeight: '600',
    textTransform: 'uppercase',
    textAlign: 'center',
    color: Colors.greyScale.white,
  },
  BUTTON_SMALL: {
    fontSize: scale(12),
    lineHeight: scale(22),
    fontWeight: '600',
    textTransform: 'uppercase',
    textAlign: 'center',
    color: Colors.greyScale.white,
  },
  LABEL_TEXT_XS: {
    fontSize: scale(8),
    lineHeight: scale(16),
    fontWeight: '600',
    color: Colors.greyScale.white,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
})

export default Typography
