import React from 'react'
import Svg, { Path } from 'react-native-svg'
import { IconProps } from '~/types/icon'
import COLORS from '~/styles/colors'

function ChatSendIcon({ width, height, color = COLORS.greyscale.white }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox='0 0 14 12' fill='none'>
      <Path
        d='M1.267 11.6L12.9 6.613a.667.667 0 000-1.226L1.267.4a.662.662 0 00-.927.607L.333 4.08c0 .333.247.62.58.66L10.333 6 .913 7.253a.674.674 0 00-.58.667l.007 3.073c0 .474.487.8.927.607z'
        fill={color}
      />
    </Svg>
  )
}

export default ChatSendIcon
