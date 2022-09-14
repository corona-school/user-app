import { useTheme, Text, View, Box, Container, Image } from 'native-base'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import ViewPager from '../../../components/ViewPager'
import WithNavigation from '../../../components/WithNavigation'

type Props = {}

const OnBoardingMatching: React.FC<Props> = () => {
  const { space } = useTheme()
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <Fragment>
      <View backgroundColor="primary.100" height="100%">
        <WithNavigation
          headerTitle={t('onboardingList.Wizard.helper.matching.title')}
          headerContent={
            <>
              <Container maxWidth="100%">
                <Box width="100%" marginBottom={space['2']}>
                  <View
                    paddingX={space['1']}
                    paddingBottom={space['1']}
                    color="lightText"
                    alignItems="center"
                    borderBottomRadius="15px"
                    backgroundColor="primary.700">
                    <Text color="lightText" textAlign="center" maxWidth="278px">
                      {t('onboardingList.Wizard.helper.matching.content')}
                    </Text>
                  </View>
                </Box>
                <Box width="100%" padding={space['1']}>
                  <ViewPager
                    onSkip={() => navigate('/onboarding-groups')}
                    onNext={() => null}
                    loop={false}>
                    <Image
                      shadow="2"
                      width="100%"
                      height="200px"
                      marginBottom={space['1']}
                      alt="Hallo"
                      source={{
                        uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80'
                      }}
                    />
                    <Image
                      shadow="2"
                      width="100%"
                      height="200px"
                      marginBottom={space['1']}
                      alt="Hallo"
                      source={{
                        uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80'
                      }}
                    />
                    <Image
                      width="100%"
                      height="200px"
                      marginBottom={space['1']}
                      alt="Hallo"
                      source={{
                        uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80'
                      }}
                    />
                    <Image
                      shadow="2"
                      width="100%"
                      height="200px"
                      marginBottom={space['1']}
                      alt="Hallo"
                      source={{
                        uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80'
                      }}
                    />
                  </ViewPager>
                </Box>
              </Container>
            </>
          }
        />
      </View>
    </Fragment>
  )
}
export default OnBoardingMatching
