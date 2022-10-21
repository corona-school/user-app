import { useNavigate } from 'react-router-dom'
import InfoScreen from '../widgets/InfoScreen'
import Logo from '../assets/icons/lernfair/lf-party.svg'
import { useEffect } from 'react'
import useApollo from '../hooks/useApollo'
import { useTranslation } from 'react-i18next'
type Props = {}

const Welcome: React.FC<Props> = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <InfoScreen
      variant="dark"
      title={t('welcome.title')}
      content={t('welcome.subtitle')}
      outlineButtonText={t('welcome.btn.login')}
      outlinebuttonLink={() => navigate('/login')}
      defaultButtonText={t('welcome.btn.signup')}
      defaultbuttonLink={() => navigate('/registration/1')}
      icon={<Logo />}
    />
  )
}
export default Welcome
