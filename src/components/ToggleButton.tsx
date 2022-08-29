import { Button } from 'native-base'
import { useState } from 'react'

type Props = {
  label: string
  onPress?: () => any
}

const ToggleButton: React.FC<Props> = ({ label, onPress }) => {
  const [active, setActive] = useState<boolean>(false)

  return (
    <Button
      bgColor={active ? 'primary.100' : 'primary.900'}
      _text={{ color: active ? 'darkText' : 'lightText' }}
      onPress={() => {
        setActive(prev => !prev)
        onPress && onPress()
      }}>
      {label}
    </Button>
  )
}
export default ToggleButton
