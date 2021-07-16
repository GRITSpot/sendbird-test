import { StyleSheet } from 'react-native'

import COLORS from '~/styles/colors'
import { scale } from '~/helpers/scaling'

const styles = StyleSheet.create({
  button: {
    height: scale(36),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scale(18),
    paddingHorizontal: scale(8),
    backgroundColor: COLORS.brand.primary,
  },
  appButtonStyle: (disabled, outlined) => ({
    height: scale(48),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scale(24),
    paddingHorizontal: scale(16),
    backgroundColor: outlined
      ? COLORS.uiSpecific.transparent
      : disabled
      ? COLORS.greyscale.light
      : COLORS.brand.primary,
    borderWidth: outlined ? scale(1) : 0,
    borderColor: disabled ? COLORS.greyscale.medium : COLORS.brand.primary,
  }),
  genericButton: {
    height: scale(48),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scale(24),
    paddingHorizontal: scale(16),
    backgroundColor: COLORS.brand.primary,
  },
  genericOutlineButton: {
    borderWidth: scale(1),
    backgroundColor: COLORS.uiSpecific.transparent,
    borderColor: COLORS.brand.primary,
  },
  genericButtonText: {
    fontSize: scale(15),
    color: COLORS.greyscale.white,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonMargin: {
    marginVertical: scale(3),
  },
  outlinedButton: {
    borderWidth: 1,
    backgroundColor: COLORS.greyscale.white,
    borderColor: COLORS.brand.primary,
  },
  noColorButton: {
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontSize: scale(13),
    color: COLORS.greyscale.white,
    fontWeight: '600',
    textAlign: 'center',
  },
  appButtonText: (disabled, outlined) => ({
    fontSize: scale(15),
    color: disabled
      ? COLORS.greyscale.medium
      : outlined
      ? COLORS.brand.primary
      : COLORS.greyscale.white,
  }),
  darkFont: {
    color: 'rgb(35,35,35)',
  },
  outlinedButtonText: {
    color: COLORS.brand.primary,
  },
  disabled: {
    backgroundColor: COLORS.greyscale.medium,
    opacity: 0.5,
  },
  outlinedButtonDisabled: {
    borderColor: COLORS.greyscale.medium,
  },
  disabledText: {
    color: 'rgba(0, 0, 0, 0.25)',
  },
  outlinedTextDisabled: {
    color: 'rgba(0, 0, 0, 0.25)',
  },
  blueButton: {
    backgroundColor: COLORS.brand.secondary,
  },
  textButton: {
    fontWeight: '600',
    fontSize: scale(15),
    color: COLORS.brand.primary,
  },
  textButtonContainer: {
    height: scale(36),
    alignItems: 'center',
    justifyContent: 'center',
  },
  thinText: {},
})

export default styles
