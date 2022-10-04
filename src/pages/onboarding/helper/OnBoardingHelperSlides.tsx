import { useTheme, View, Container } from 'native-base'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import ViewPager from '../../../components/ViewPager'
import OnboardingView from '../../../widgets/OnboardingView'

type Props = {}

const OnBoardingHelperSlides: React.FC<Props> = () => {
  const { space } = useTheme()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [cancelModal, setCancelModal] = useState<boolean>(false)

  const imgMatching = require('../../../assets/images/onboarding/helper/All_Helfer_Matching_1_1.png')
  const imgGroup = require('../../../assets/images/onboarding/helper/All_Helfer_Matching_Gruppe.png')
  const imgAppointments = require('../../../assets/images/onboarding/helper/All_Helfer_Termine.png')
  const imgHelpCenter = require('../../../assets/images/onboarding/helper/All_Helfer_Hilfe.png')
  const imgProfile = require('../../../assets/images/onboarding/helper/All_Helfer_Matching_Profil.png')
  const imgSettings = require('../../../assets/images/onboarding/helper/All_Helfer_Einstellungen.png')
  const imgNotification = require('../../../assets/images/onboarding/helper/All_Helfer_Matching_Benachrichtigung.png')

  const onFinish = useCallback(() => {}, [])

  return (
    <Container
      backgroundColor="primary.100"
      maxWidth="100%"
      height="100%"
      alignItems="stretch">
      <View flex={1}>
        <ViewPager
          isOnboarding={true}
          onFinish={() => navigate('/onboarding-helper/finish')}>
          {/* Matching */}
          <OnboardingView
            title={t('onboardingList.Wizard.helper.matching.title')}
            content={t('onboardingList.Wizard.helper.matching.content')}
            image={imgMatching}
          />

          {/* Group */}
          <OnboardingView
            title={t('onboardingList.Wizard.helper.groupCourse.title')}
            content={t('onboardingList.Wizard.helper.groupCourse.content')}
            image={imgGroup}
          />

          {/* Appointments */}
          <OnboardingView
            title={t('onboardingList.Wizard.helper.appointment.title')}
            content={t('onboardingList.Wizard.helper.appointment.content')}
            image={imgAppointments}
          />

          {/* HelpCenter */}
          <OnboardingView
            title={t('onboardingList.Wizard.helper.helpCenter.title')}
            content={t('onboardingList.Wizard.helper.helpCenter.content')}
            image={imgHelpCenter}
          />

          {/* Profil */}
          <OnboardingView
            title={t('onboardingList.Wizard.helper.profile.title')}
            content={t('onboardingList.Wizard.helper.profile.content')}
            image={imgProfile}
          />

          {/* Settings */}
          <OnboardingView
            title={t('onboardingList.Wizard.helper.settings.title')}
            content={t('onboardingList.Wizard.helper.settings.content')}
            image={imgSettings}
          />

          {/* Notification */}
          <OnboardingView
            title={t('onboardingList.Wizard.helper.notification.title')}
            content={t('onboardingList.Wizard.helper.notification.content')}
            image={imgNotification}
          />
        </ViewPager>
      </View>
    </Container>
  )
}
export default OnBoardingHelperSlides
