import React from 'react'
import Svg, { Path } from 'react-native-svg'

import COLORS from '~/styles/colors'
import { IconProps } from '~/types/icon'

const BackArrow = ({
  width = 16,
  height = 16,
  color = COLORS.greyscale.almostBlack,
}: IconProps) => {
  return (
    <Svg width={width} height={height} viewBox='0 0 8 14' fill='none'>
      <Path
        fill-rule='evenodd'
        clip-rule='evenodd'
        d='M7.70491 13.6533C8.11167 13.2059 8.09597 12.4969 7.66984 12.0698L2.6115 7L7.66984 1.93016C8.09597 1.50306 8.11167 0.794108 7.70491 0.346671C7.29815 -0.100769 6.62296 -0.117255 6.19683 0.309845L0.330161 6.18984C0.119301 6.40118 1.27744e-06 6.69392 1.22392e-06 7C1.1704e-06 7.30608 0.119301 7.59882 0.33016 7.81016L6.19682 13.6902C6.62296 14.1173 7.29815 14.1008 7.70491 13.6533Z'
        fill={color}
      />
    </Svg>
  )
}

export default BackArrow
