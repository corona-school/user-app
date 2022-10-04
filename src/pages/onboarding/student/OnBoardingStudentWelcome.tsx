import { useTheme, Text, View, Modal } from 'native-base'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Logo from '../../../assets/icons/lernfair/lf-logo.svg'
import { useState } from 'react'
import InfoScreen from '../../../widgets/InfoScreen'
import OnBoardingSkipModal from '../../../widgets/OnBoardingSkipModal'

type Props = {}

const OnBoardingStudentWelcome: React.FC<Props> = () => {
  const { space } = useTheme()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [cancelModal, setCancelModal] = useState<boolean>(false)

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
          setCancelModal(true)
        }}
        defaultButtonText={t(
          'onboardingList.Wizard.students.welcome.startTour'
        )}
        defaultbuttonLink={() => navigate('/onboarding-students/wizard')}
        icon={<Logo />}
      />
      <Modal
        bg="modalbg"
        isOpen={cancelModal}
        onClose={() => setCancelModal(false)}>
        <OnBoardingSkipModal
          onPressClose={() => setCancelModal(false)}
          onPressDefaultButton={() => setCancelModal(false)}
          onPressOutlineButton={() => navigate('/')}
        />
      </Modal>
    </View>
  )
}
export default OnBoardingStudentWelcome
