export interface IconProps {
  width?: number
  height?: number
  color?: string
}

export interface IconWithBackgroundProps extends IconProps {
  backgroundColor?: string
  stroke?: string
}
