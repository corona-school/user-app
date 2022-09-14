import { Heading, useTheme, Text, View } from 'native-base'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Logo from '../../../assets/icons/lernfair/lf-party.svg'
import { useContext } from 'react'
import InfoScreen from '../../../widgets/InfoScreen'
import { ModalContext } from '../../../widgets/FullPageModal'

type Props = {}

const OnBoardingStudentWelcome: React.FC<Props> = () => {
  const { space } = useTheme()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { setShow, setContent, setVariant } = useContext(ModalContext)

  return (
    <View>
      <InfoScreen
        variant="dark"
        title={t('onboardingList.Wizard.students.welcome.title')}
        isOutlineButtonLink={true}
        content={
          <>
            <Text color="lightText" paddingBottom={space['1.5']}>
              {t('onboardingList.Wizard.students.welcome.content')}
            </Text>
            <Text
              maxWidth="240px"
              marginX="auto"
              bold
              color="lightText"
              paddingBottom={space['0.5']}>
              {t('onboardingList.Wizard.students.welcome.question')}
            </Text>
            <Text color="lightText">
              {t('onboardingList.Wizard.students.welcome.answer')}
            </Text>
          </>
        }
        outlineButtonText={t('onboardingList.Wizard.students.welcome.skipTour')}
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
        defaultButtonText={t(
          'onboardingList.Wizard.students.welcome.startTour'
        )}
        defaultbuttonLink={() => navigate('/onboarding-students/matching')}
        icon={<Logo />}
      />
    </View>
  )
}
export default OnBoardingStudentWelcome
