import { FavouriteIcon } from 'native-base'
import { useNavigate } from 'react-router-dom'
import InfoScreen from '../widgets/InfoScreen'
type Props = {}

const Welcome: React.FC<Props> = () => {
  const navigate = useNavigate()
  return (
    <InfoScreen
      variant="dark"
      title="Herzlich willkommen bei Lern-Fair"
      content="Hast du breits einen Account? Oder bist du neu bei uns und möchtest dich registrieren?"
      outlineButtonText="Anmelden"
      outlinebuttonLink={() => navigate('/login')}
      defaultButtonText="Neu registrieren"
      defaultbuttonLink={() => navigate('/register')}
      icon={<FavouriteIcon size="xl" color="white" />}
    />
  )
}
export default Welcome
