import React from 'react'
import Svg, { Path } from 'react-native-svg'
import { IconProps } from '../../types/icon'
import COLORS from '~/styles/colors'

function NoAvatar({ width, height, color = COLORS.greyscale.medium }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox='0 0 34 34' fill='none'>
      <Path
        d='M17 .333C7.796.333.333 7.796.333 17S7.796 33.667 17 33.667 33.667 26.204 33.667 17C33.657 7.8 26.2.343 17 .333zm10.403 25.332C22.62 31.41 14.086 32.19 8.342 27.408a13.423 13.423 0 01-1.743-1.743.346.346 0 01.1-.527 45.96 45.96 0 015.61-2.319l.937-.345c.367-.212.612-.584.662-1.005a3.046 3.046 0 00-.345-2.433c-1.166-1.283-2.305-2.867-2.305-6.826A5.614 5.614 0 0117 6.099a5.614 5.614 0 015.743 6.11c0 3.96-1.139 5.544-2.304 6.827a3.046 3.046 0 00-.346 2.433c.05.421.296.793.663 1.005l.937.345a46.231 46.231 0 015.608 2.317.36.36 0 01.175.24.345.345 0 01-.073.29z'
        fill={color}
      />
    </Svg>
  )
}

export default NoAvatar
