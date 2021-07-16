import React from 'react'
import Svg, { Path } from 'react-native-svg'
import { IconProps } from '../../types/icon'
import COLORS from '~/styles/colors'

function WarningIcon({ width = 14, height = 12, color = COLORS.brand.primary }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox='0 0 14 12' fill='none'>
      <Path
        d='M1.733 12h10.534c1.077 0 1.749-1.178 1.21-2.117L8.21.703a1.392 1.392 0 00-2.42 0L.523 9.884C-.015 10.822.656 12 1.733 12zM7 7.061a.705.705 0 01-.7-.706v-1.41c0-.389.315-.706.7-.706.385 0 .7.317.7.705v1.411a.705.705 0 01-.7.706zm.7 2.117a.705.705 0 01-.7.705.705.705 0 010-1.411c.386 0 .7.32.7.706z'
        fill={color}
      />
    </Svg>
  )
}

export default WarningIcon
