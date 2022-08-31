import { Button } from 'native-base'

type Props = {
  label: string
  dataKey: string
  isActive: boolean
  onPress?: (key: string) => any
}

const ToggleButton: React.FC<Props> = ({
  label,
  dataKey,
  onPress,
  isActive
}) => {
  return (
    <Button
      bgColor={isActive ? 'primary.100' : 'primary.900'}
      _text={{ color: isActive ? 'darkText' : 'lightText' }}
      onPress={() => {
        onPress && onPress(dataKey)
      }}>
      {label}
    </Button>
  )
}
export default ToggleButton
