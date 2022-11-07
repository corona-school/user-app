import { useMatomo } from '@jonkoops/matomo-tracker-react'
import { useTheme, View, Container } from 'native-base'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import ViewPager from '../../../components/ViewPager'
import OnboardingView from '../../../widgets/OnboardingView'

type Props = {}

const OnBoardingHelperMatchingSlides: React.FC<Props> = () => {
  const { space } = useTheme()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [cancelModal, setCancelModal] = useState<boolean>(false)

  const imgRequestMatching = require('../../../assets/images/onboarding/1-1-helper/1_1_Helfer_Match_anfordern.png')
  const imgRequest = require('../../../assets/images/onboarding/1-1-helper/1_1_Helfer_Anfrage stellen.png')
  const imgMatch = require('../../../assets/images/onboarding/1-1-helper/1_1_Helfer_Matching.png')
  const imgContact = require('../../../assets/images/onboarding/1-1-helper/1_1_Helfer_Kontaktaufnahme.png')
  const imgSolveMatching = require('../../../assets/images/onboarding/1-1-helper/1_1_Helfer_Match_aufloesen.png')

  const onFinish = useCallback(() => {}, [])
  const { trackPageView } = useMatomo()

  useEffect(() => {
    trackPageView({
      documentTitle: 'Helfer Matching Onboarding Slides'
    })
  }, [])

  return (
    <Container
      backgroundColor="primary.100"
      maxWidth="100%"
      height="100%"
      overflowY="scroll"
      alignItems="stretch">
      <View flex={1}>
        <ViewPager
          isOnboarding={true}
          onFinish={() => navigate('/onboarding/helpermatching/finish')}>
          {/* Request Matching */}
          <OnboardingView
            title={t('onboardingList.Wizard.helperMatching.matching.title')}
            content={t('onboardingList.Wizard.helperMatching.matching.content')}
            image={imgRequestMatching}
          />

          {/* Request */}
          <OnboardingView
            title={t('onboardingList.Wizard.helperMatching.request.title')}
            content={t('onboardingList.Wizard.helperMatching.request.content')}
            image={imgRequest}
            isBigger={true}
          />

          {/* Match */}
          <OnboardingView
            title={t('onboardingList.Wizard.helperMatching.match.title')}
            content={t('onboardingList.Wizard.helperMatching.match.content')}
            contentEnd={t(
              'onboardingList.Wizard.helperMatching.match.contentsec'
            )}
            image={imgMatch}
            isBigger={true}
          />

          {/* Contact */}
          <OnboardingView
            title={t('onboardingList.Wizard.helperMatching.contact.title')}
            content={t('onboardingList.Wizard.helperMatching.contact.content')}
            contentEnd={t(
              'onboardingList.Wizard.helperMatching.contact.contentsec'
            )}
            image={imgContact}
          />

          {/* Solve Matching */}
          <OnboardingView
            title={t('onboardingList.Wizard.helperMatching.matchSolve.title')}
            content={t(
              'onboardingList.Wizard.helperMatching.matchSolve.content'
            )}
            image={imgSolveMatching}
          />
        </ViewPager>
      </View>
    </Container>
  )
}
export default OnBoardingHelperMatchingSlides
