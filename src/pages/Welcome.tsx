import { useNavigate } from 'react-router-dom'
import InfoScreen from '../widgets/InfoScreen'
import Logo from '../assets/icons/lernfair/lf-party.svg'
import { useEffect } from 'react'
import useApollo from '../hooks/useApollo'
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
      defaultbuttonLink={() => navigate('/registration/1')}
      icon={<Logo />}
    />
  )
}
export default Welcome
