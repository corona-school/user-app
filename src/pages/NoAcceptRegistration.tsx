import { useTheme, Text, View, Modal } from 'native-base'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Logo from '../assets/icons/lernfair/lf-warning.svg'
import { useEffect, useState } from 'react'
import { useMatomo } from '@jonkoops/matomo-tracker-react'
import InfoScreen from '../widgets/InfoScreen'

type Props = {}

const NoAcceptRegistration: React.FC<Props> = () => {
  const { space } = useTheme()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [cancelModal, setCancelModal] = useState<boolean>(false)

  const { trackPageView, trackEvent } = useMatomo()

  useEffect(() => {
    trackPageView({
      documentTitle: 'Schüler Onboarding'
    })
  }, [])

  return (
    <View>
      <InfoScreen
        variant="dark"
        title="Registrierung fehlgeschlagen!"
        isOutlineButtonLink={true}
        content={
          <>
            <Text color="lightText" paddingY={space['0.5']} display="block">
              Da Du unsere Teilnahmebedingungen abgelehnt hast, können wir Dir
              leider keine Registrierung ermöglichen.
            </Text>
            <Text
              bold
              color="lightText"
              paddingBottom={space['0.5']}
              display="block">
              Erst nach dem Bestätigen unserer Teilnahmebedingungen können wir
              Dir gerne die Registrierung gewähren.
            </Text>
          </>
        }
        outlineButtonText="Registrierung erneut beginnen"
        outlinebuttonLink={() => {
          navigate('/registration/1')
        }}
        defaultButtonText="Weitere Infos erhalten"
        defaultbuttonLink={() => {
          window.open('https://www.lern-fair.de/', '_blank')
        }}
        icon={<Logo />}
      />
      <Modal
        bg="modalbg"
        isOpen={cancelModal}
        onClose={() => setCancelModal(false)}>
        <Text>Hallo</Text>
      </Modal>
    </View>
  )
}
export default NoAcceptRegistration
