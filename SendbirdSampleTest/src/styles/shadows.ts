import COLORS from './colors'

const SHADOWS = {
  cards: {
    shadowColor: COLORS.greyscale.almostBlack,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,

    elevation: 4,
  },
  navigation: {
    shadowColor: COLORS.greyscale.almostBlack,
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 0.07,
    shadowRadius: 8,

    elevation: 8,
  },
  floating: {
    shadowColor: COLORS.greyscale.almostBlack,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,

    elevation: 16,
  },
  modal: {
    shadowColor: COLORS.greyscale.almostBlack,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.1,
    shadowRadius: 24,

    elevation: 24,
  },
}

export default SHADOWS
