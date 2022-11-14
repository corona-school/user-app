import { Button, HamburgerIcon } from 'native-base'
import { useNavigate } from 'react-router-dom'

type Props = {}

const SettingsButton: React.FC<Props> = () => {
  const navigate = useNavigate()
  return (
    <Button bgColor="" ml={-4} onPress={() => navigate('/settings')}>
      <HamburgerIcon size="xl" color="lightText" />
    </Button>
  )
}
export default SettingsButton
