import { useLocation, useNavigate } from 'react-router-dom'
import InfoScreen from '../widgets/InfoScreen'
import Logo from '../assets/icons/lernfair/lf-party.svg'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useMatomo } from '@jonkoops/matomo-tracker-react'
import AlertMessage from '../widgets/AlertMessage'

const Welcome: React.FC = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { trackPageView } = useMatomo()

  const location = useLocation()
  const locState = location.state as { deactivated?: boolean }
  const deactivated = locState?.deactivated

  useEffect(() => {
    trackPageView({
      documentTitle: 'Welcome Page'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <InfoScreen
      variant="dark"
      title={t('welcome.title')}
      content={t('welcome.subtitle')}
      outlineButtonText={t('welcome.btn.login')}
      outlinebuttonLink={() => navigate('/login')}
      defaultButtonText={t('welcome.btn.signup')}
      defaultbuttonLink={() => navigate('/registration')}
      icon={<Logo />}
      extraContent={
        deactivated && (
          <AlertMessage content={'Dein Account wurde deaktiviert'} />
        )
      }
    />
  )
}
export default Welcome
