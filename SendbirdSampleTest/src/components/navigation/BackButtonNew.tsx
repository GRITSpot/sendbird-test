import * as React from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'

import ArrowIcon from '~/assets/icons/arrow'
import BackArrow from '~/assets/icons/backArrow'
import { scale } from '~/helpers/scaling'

type Props = {
  type?: 'ChevronLeft'
  onPress: () => void
}

const BackButton: React.FC<Props> = ({ type, onPress }) => (
  <TouchableOpacity onPress={onPress} style={style.container}>
    {type === 'ChevronLeft' ? <BackArrow /> : <ArrowIcon />}
  </TouchableOpacity>
)

const style = StyleSheet.create({
  container: {
    paddingHorizontal: scale(16),
  },
})

export default BackButton
