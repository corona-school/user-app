import { HamburgerIcon } from 'native-base'
import { TouchableOpacity } from 'react-native'
import { useNavigate } from 'react-router-dom'

type Props = {}

const SettingsButton: React.FC<Props> = () => {
  const navigate = useNavigate()
  return (
    <TouchableOpacity onPress={() => navigate('/settings')}>
      <HamburgerIcon size="xl" color="lightText" />
    </TouchableOpacity>
  )
}
export default SettingsButton
