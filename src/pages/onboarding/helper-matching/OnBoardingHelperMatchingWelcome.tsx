import { Heading, useTheme, Text, View } from 'native-base'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import MatchingCard from '../../../assets/icons/lernfair/lf-matching-card.svg'
import { useContext } from 'react'
import InfoScreen from '../../../widgets/InfoScreen'
import { ModalContext } from '../../../widgets/FullPageModal'

type Props = {}

const OnBoardingHelperMatchingWelcome: React.FC<Props> = () => {
  const { space } = useTheme()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { setShow, setContent, setVariant } = useContext(ModalContext)

  return (
    <View>
      <InfoScreen
        variant="dark"
        title={t('onboardingList.Wizard.helperMatching.welcome.title')}
        isOutlineButtonLink={true}
        content={
          <>
            <Text color="lightText" paddingBottom={space['1.5']}>
              {t('onboardingList.Wizard.helperMatching.welcome.content')}
            </Text>
            <Text
              maxWidth="240px"
              marginX="auto"
              bold
              color="lightText"
              paddingBottom={space['0.5']}>
              {t('onboardingList.Wizard.helperMatching.welcome.question')}
            </Text>
            <Text color="lightText">
              {t('onboardingList.Wizard.helperMatching.welcome.answer')}
            </Text>
          </>
        }
        outlineButtonText={t(
          'onboardingList.Wizard.helperMatching.welcome.skipTour'
        )}
        outlinebuttonLink={() => {
          setVariant('light')
          setContent(
            <InfoScreen
              icon={<MatchingCard />}
              content={
                <>
                  <Heading
                    color="lightText"
                    fontSize="md"
                    paddingY={space['1']}>
                    {t(
                      'onboardingList.Wizard.helperMatching.welcome.popup.title'
                    )}
                  </Heading>
                  <Text color="lightText">
                    {t(
                      'onboardingList.Wizard.helperMatching.welcome.popup.content'
                    )}
                  </Text>
                </>
              }
              defaultButtonText={t(
                'onboardingList.Wizard.helperMatching.welcome.popup.defaultButtonText'
              )}
              outlineButtonText={t(
                'onboardingList.Wizard.helperMatching.welcome.popup.outlineButtonText'
              )}
              isdefaultButtonFirst={true}
              defaultbuttonLink={() => navigate('/')}
              outlinebuttonLink={() => setShow(false)}
            />
          )
          setShow(true)
        }}
        defaultButtonText={t(
          'onboardingList.Wizard.helperMatching.welcome.startTour'
        )}
        defaultbuttonLink={() =>
          navigate('/onboarding-helper-matching/request-matching')
        }
        icon={<MatchingCard />}
      />
    </View>
  )
}
export default OnBoardingHelperMatchingWelcome
