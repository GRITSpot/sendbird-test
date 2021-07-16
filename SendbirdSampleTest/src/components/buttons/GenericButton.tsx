import React from 'react'
import {
  TouchableOpacity,
  Text,
  ViewStyle,
  TextStyle,
} from 'react-native'
import styles from './styles'

interface Props {
  outlined?: boolean
  disabled?: boolean
  onPress: () => void
  customButtonStyle?: ViewStyle
  customTextStyle?: TextStyle
  children: string
}

const GenericButton = ({
  outlined,
  disabled,
  customButtonStyle,
  customTextStyle,
  onPress,
  children,
}: Props) => (
  <TouchableOpacity
    activeOpacity={0.7}
    disabled={disabled}
    onPress={onPress}
    style={[
      styles.genericButton,
      outlined && styles.genericOutlineButton,
      disabled && (outlined ? styles.outlinedButtonDisabled : styles.disabled),
      customButtonStyle,
    ]}
  >
    <Text
      style={[
        styles.genericButtonText,
        outlined && styles.outlinedButtonText,
        disabled && (outlined ? styles.outlinedTextDisabled : styles.disabledText),
        customTextStyle,
      ]}
    >
      {children.toString()}
    </Text>
  </TouchableOpacity>
)

export default GenericButton
