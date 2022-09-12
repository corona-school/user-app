import { Button, Pressable, Row, Text, useTheme, View } from 'native-base'
import { Touchable } from 'react-native'

type Props = {
  label: string
  dataKey: string
  isActive: boolean
  onPress?: (key: string) => any
  Icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
}

const ToggleButton: React.FC<Props> = ({
  label,
  dataKey,
  onPress,
  isActive,
  Icon
}) => {
  const { space } = useTheme()
  return (
    <Pressable
      bgColor={isActive ? 'primary.900' : 'primary.100'}
      borderRadius={4}
      onPress={() => {
        onPress && onPress(dataKey)
      }}>
      <Row
        width="100%"
        alignItems="center"
        space={space['0.5']}
        padding={Icon ? space['0.5'] : space['1']}>
        {Icon && <Icon />}
        <Text fontSize={'md'} bold color={isActive ? 'lightText' : 'darkText'}>
          {label}
        </Text>
      </Row>
    </Pressable>
  )
}
export default ToggleButton
