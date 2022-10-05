import { useTheme, View, Container } from 'native-base'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import ViewPager from '../../../components/ViewPager'
import OnboardingView from '../../../widgets/OnboardingView'

type Props = {}

const OnBoardingStudentSlides: React.FC<Props> = () => {
  const { space } = useTheme()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [cancelModal, setCancelModal] = useState<boolean>(false)

  const imgMatching = require('../../../assets/images/onboarding/student/All_Schueler_Matching_1_1.png')
  const imgGroup = require('../../../assets/images/onboarding/student/All_Schueler_Matching_Gruppe.png')
  const imgAppointments = require('../../../assets/images/onboarding/student/All_Schueler_Termine.png')

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
          onFinish={() => navigate('/onboarding/students/finish')}>
          {/* Matching */}
          <OnboardingView
            title={t('onboardingList.Wizard.students.matching.title')}
            content={t('onboardingList.Wizard.students.matching.content')}
            image={imgMatching}
          />
          {/* Group */}
          <OnboardingView
            title={t('onboardingList.Wizard.students.groupCourse.title')}
            content={t('onboardingList.Wizard.students.groupCourse.content')}
            image={imgGroup}
          />

          {/* Appointments */}
          <OnboardingView
            title={t('onboardingList.Wizard.students.appointments.title')}
            content={t('onboardingList.Wizard.students.appointments.content')}
            image={imgAppointments}
          />
        </ViewPager>
      </View>
    </Container>
  )
}
export default OnBoardingStudentSlides
