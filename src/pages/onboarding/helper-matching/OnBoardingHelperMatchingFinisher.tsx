import { useTheme, Text, View, Heading, Link, Box } from 'native-base'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import InfoScreen from '../../../widgets/InfoScreen'
import MatchingCheck from '../../../assets/icons/lernfair/lf-matching-check.svg'

type Props = {}

const OnBoardingHelperMatchingFinisher: React.FC<Props> = () => {
  const { space } = useTheme()
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <>
      <View>
        <InfoScreen
          variant="dark"
          title={t('onboardingList.Wizard.helperMatching.finisher.title')}
          isOutlineButtonLink={true}
          content={
            <>
              <Text
                color="lightText"
                textAlign="center"
                maxWidth="300px"
                marginBottom={space['1.5']}>
                {t(
                  'onboardingList.Wizard.helperMatching.finisher.firstContent'
                )}
              </Text>
              <Heading
                color="lightText"
                fontSize="md"
                textAlign="center"
                maxWidth="300px"
                marginBottom={space['0.5']}>
                {t(
                  'onboardingList.Wizard.helperMatching.finisher.headlineContent'
                )}
              </Heading>
              <Text
                color="lightText"
                textAlign="center"
                maxWidth="300px"
                marginX="auto"
                marginBottom={space['1.5']}>
                {t('onboardingList.Wizard.helperMatching.finisher.answer')}
              </Text>
              <Box alignItems="center">
                <Link
                  _text={{
                    color: 'primary.400',
                    fontWeight: 600
                  }}
                  textAlign="center"
                  onPress={() => navigate('/hilfebereich')}>
                  {t(
                    'onboardingList.Wizard.helperMatching.finisher.helpcenter'
                  )}
                </Link>
              </Box>
            </>
          }
          outlineButtonText={t(
            'onboardingList.Wizard.helperMatching.finisher.buttonLinkText'
          )}
          outlinebuttonLink={() => {
            navigate('/onboarding-helper-matching/welcome')
          }}
          defaultButtonText={t(
            'onboardingList.Wizard.helperMatching.finisher.buttonText'
          )}
          defaultbuttonLink={() => navigate('/dashboard')}
          icon={<MatchingCheck />}
        />
      </View>
    </>
  )
}
export default OnBoardingHelperMatchingFinisher
