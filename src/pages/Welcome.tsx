import { useNavigate } from 'react-router-dom'
import InfoScreen from '../widgets/InfoScreen'
import Logo from '../assets/icons/lernfair/lf-party.svg'
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
      icon={<Logo />}
    />
  )
}
export default Welcome
