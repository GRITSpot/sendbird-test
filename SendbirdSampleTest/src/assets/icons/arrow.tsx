import React from 'react'
import Svg, { Path } from 'react-native-svg'

import COLORS from '~/styles/colors'
import { IconProps } from '~/types/icon'

function ArrowIcon({ width = 16, height = 16, color = COLORS.greyscale.almostBlack }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox='0 0 16 16' fill='none'>
      <Path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M0 8a1 1 0 011-1h14a1 1 0 110 2H1a1 1 0 01-1-1z'
        fill={color}
      />
      <Path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M8.707.293a1 1 0 010 1.414L2.414 8l6.293 6.293a1 1 0 11-1.414 1.414l-7-7a1 1 0 010-1.414l7-7a1 1 0 011.414 0z'
        fill={color}
      />
    </Svg>
  )
}

export default ArrowIcon
