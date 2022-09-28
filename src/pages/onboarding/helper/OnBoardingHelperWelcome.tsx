import { useTheme, Text, View, Modal } from 'native-base'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Logo from '../../../assets/icons/lernfair/lf-logo.svg'
import { useState } from 'react'
import InfoScreen from '../../../widgets/InfoScreen'
import OnBoardingSkipModal from '../../../widgets/OnBoardingSkipModal'

type Props = {}

const OnBoardingHelperWelcome: React.FC<Props> = () => {
  const { space } = useTheme()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [cancelModal, setCancelModal] = useState<boolean>(false)

  return (
    <View>
      <InfoScreen
        variant="dark"
        title={t('onboardingList.Wizard.helper.welcome.title')}
        isOutlineButtonLink={true}
        content={
          <>
            <Text color="lightText" paddingBottom={space['1.5']}>
              {t('onboardingList.Wizard.helper.welcome.content')}
            </Text>
            <Text
              maxWidth="240px"
              marginX="auto"
              bold
              color="lightText"
              paddingBottom={space['0.5']}>
              {t('onboardingList.Wizard.helper.welcome.question')}
            </Text>
            <Text color="lightText">
              {t('onboardingList.Wizard.helper.welcome.answer')}
            </Text>
          </>
        }
        outlineButtonText={t('onboardingList.Wizard.helper.welcome.skipTour')}
        outlinebuttonLink={() => setCancelModal(true)}
        defaultButtonText={t('onboardingList.Wizard.helper.welcome.startTour')}
        defaultbuttonLink={() => navigate('/onboarding-helper/matching')}
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
export default OnBoardingHelperWelcome
