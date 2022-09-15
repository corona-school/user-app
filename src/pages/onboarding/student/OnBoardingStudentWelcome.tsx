import { Heading, useTheme, Text, View } from 'native-base'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Logo from '../../../assets/icons/lernfair/lf-logo.svg'
import Warning from '../../../assets/icons/lernfair/lf-warning.svg'
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
          setVariant('dark')
          setContent(
            <InfoScreen
              icon={<Warning />}
              content={
                <>
                  <Heading
                    color="lightText"
                    fontSize="md"
                    paddingY={space['1']}>
                    {t('onboardingList.Wizard.students.welcome.popup.title')}
                  </Heading>
                  <Text color="lightText">
                    {t('onboardingList.Wizard.students.welcome.popup.content')}
                  </Text>
                </>
              }
              defaultButtonText={t(
                'onboardingList.Wizard.students.welcome.popup.defaultButtonText'
              )}
              outlineButtonText={t(
                'onboardingList.Wizard.students.welcome.popup.outlineButtonText'
              )}
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
