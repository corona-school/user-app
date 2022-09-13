import { Heading, useTheme, Text, View } from 'native-base'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Logo from '../../assets/icons/lernfair/lf-party.svg'
import InfoScreen from '../../widgets/InfoScreen'
import { ModalContext } from '../../widgets/FullPageModal'
import { useContext } from 'react'

type Props = {}

const OnBoardingWelcome: React.FC<Props> = () => {
  const { space } = useTheme()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { setShow, setContent, setVariant } = useContext(ModalContext)

  return (
    <View>
      <InfoScreen
        variant="dark"
        title="Herzlich willkommen bei Lern-Fair"
        isOutlineButtonLink={true}
        content={
          <>
            <Text color="lightText" paddingBottom={space['1.5']}>
              Wir freuen uns, dass du bildungs-benachteiligte Kinder aktiv
              unterstützen möchtest.
            </Text>
            <Text
              maxWidth="240px"
              marginX="auto"
              bold
              color="lightText"
              paddingBottom={space['0.5']}>
              Möchtest du sehen, was unsere Plattform alles zu bieten hat?
            </Text>
            <Text color="lightText">
              Wir zeigen dir die wichtigsten Funktionen.
            </Text>
          </>
        }
        outlineButtonText="Tour überspringen"
        outlinebuttonLink={() => {
          setVariant('light')
          setContent(
            <InfoScreen
              icon={<Logo />}
              content={
                <>
                  <Heading
                    color="lightText"
                    fontSize="md"
                    paddingY={space['1']}>
                    Bist du sicher, dass du die Tour überspringen möchtest?
                  </Heading>
                  <Text color="lightText">
                    Du kannst die Tour auch jederzeit neu starten. Du findest
                    den Punkt unter deinen Einstellungen als Punkt
                    „Onboarding-Tour“.
                  </Text>
                </>
              }
              defaultButtonText="Nein, Tour beginnen"
              outlineButtonText="Ja, Tour überspringen"
              isdefaultButtonFirst={true}
              defaultbuttonLink={() => navigate('/')}
              outlinebuttonLink={() => setShow(false)}
            />
          )
          setShow(true)
        }}
        defaultButtonText="Tour starten"
        defaultbuttonLink={() => navigate('/onboarding-matching')}
        icon={<Logo />}
      />
    </View>
  )
}
export default OnBoardingWelcome
