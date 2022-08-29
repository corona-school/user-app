import { useNavigate } from 'react-router-dom'
import InfoScreen from '../widgets/InfoScreen'
import Logo from '../assets/icons/lernfair/lf-party.svg'
type Props = {}

const Welcome: React.FC<Props> = () => {
  const navigate = useNavigate()
  return (
    <InfoScreen
      variant="dark"
      title="welcome.title"
      content="welcome.subtitle"
      outlineButtonText="welcome.btn.login"
      outlinebuttonLink={() => navigate('/login')}
      defaultButtonText="welcome.btn.signup"
      defaultbuttonLink={() => navigate('/register')}
      icon={<Logo />}
    />
  )
}
export default Welcome
