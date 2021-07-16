import { Dimensions, Platform } from 'react-native'

const { width, height } = Dimensions.get('screen')
const heightWindow = Dimensions.get('window').height

// Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 375
export const guidelineBaseHeight = 667

const platform = Platform.OS
const scale = (size) => (width / guidelineBaseWidth) * size
const verticalScale = (size) => (height / guidelineBaseHeight) * size
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor

export { scale, verticalScale, moderateScale, platform, heightWindow, width, height }
