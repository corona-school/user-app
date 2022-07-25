import { View, Text, useTheme } from 'native-base'

type Props = {
  text: string
  borderRadius?: number
  padding?: number | string
  paddingX?: number | string
  paddingY?: number | string
  borderColor?: string
}

const Tag: React.FC<Props> = ({
  text,
  borderRadius,
  padding,
  paddingX,
  paddingY,
  borderColor
}) => {
  const padX = padding || paddingX || '1'
  const padY = padding || paddingY || '1'
  const { colors } = useTheme()

  return (
    <Text
      fontSize={'xs'}
      paddingX={padX}
      paddingY={padY}
      bg={borderColor ? 'transparent' : 'gray.300'}
      borderRadius={borderRadius || 4}
      borderWidth={1}
      borderColor={borderColor || 'transparent'}
      color={colors.text['50']}>
      {text}
    </Text>
  )
}
export default Tag
