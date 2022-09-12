import { View, Text, useTheme, Row, Box } from 'native-base'
import { ReactNode, useMemo } from 'react'

type Props = {
  text: string
  borderRadius?: number
  padding?: number | string
  paddingX?: number | string
  paddingY?: number | string
  borderColor?: string
  variant?: 'normal' | 'outline' | 'rating' | 'secondary'
  beforeElement?: ReactNode | ReactNode[]
  afterElement?: ReactNode | ReactNode[]
  isReview?: boolean
}

const Tag: React.FC<Props> = ({
  text,
  borderRadius,
  padding,
  paddingX,
  paddingY,
  borderColor,
  variant = 'normal',
  beforeElement,
  afterElement,
  isReview
}) => {
  const { colors, space } = useTheme()

  const pad = useMemo(
    () => [padding || paddingX || '1', padding || paddingY || '1'],
    [padding, paddingX, paddingY]
  )

  const bg = useMemo(() => {
    switch (variant) {
      case 'normal':
        return 'primary.700'
      case 'outline':
        return 'transparent'
      case 'rating':
        return colors.text['50']
      case 'secondary':
        return 'primary.500'
      default:
        return colors.text['50']
    }
  }, [colors.text, variant])

  const color = useMemo(
    () => (variant === 'normal' ? colors.text['50'] : colors.text['900']),
    [colors.text, variant]
  )

  return (
    <Box
      paddingX={pad[0]}
      paddingY={pad[1]}
      marginBottom={space['0.5']}
      bg={bg}
      borderRadius={borderRadius || 4}
      borderWidth={1}
      borderColor={borderColor || 'transparent'}>
      <Row space={space['0.5']}>
        {beforeElement && <View testID="beforeElement">{beforeElement}</View>}
        <Text fontSize={'xs'} color={color} bold={isReview ? true : false}>
          {text}
        </Text>
        {afterElement && <View testID="afterElement">{afterElement}</View>}
      </Row>
    </Box>
  )
}
export default Tag
