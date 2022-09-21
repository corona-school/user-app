import {
  useTheme,
  Text,
  View,
  Box,
  Container,
  Image,
  Row,
  HStack,
  Link,
  CircleIcon,
  Column,
  Modal
} from 'native-base'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import WithNavigation from '../../../components/WithNavigation'
import OnBoardingSkipModal from '../../../widgets/OnBoardingSkipModal'

type Props = {}

const OnBoardingHelperMatchingSolveMatching: React.FC<Props> = () => {
  const { space } = useTheme()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [cancelModal, setCancelModal] = useState<boolean>(false)
  const img = require('../../../assets/images/onboarding/1-1-helper/1_1_Helfer_Match_aufloesen.png')

  return (
    <>
      <View backgroundColor="primary.100" height="100%">
        <WithNavigation
          headerTitle={t(
            'onboardingList.Wizard.helperMatching.matchSolve.title'
          )}
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
                      {t(
                        'onboardingList.Wizard.helperMatching.matchSolve.content'
                      )}
                    </Text>
                  </View>
                </Box>
                <Box width="100%" padding={space['1']}>
                  <Row marginBottom={space['1']}>
                    <Image
                      width="100%"
                      height="350px"
                      alt="Matching"
                      resizeMode="contain"
                      source={{ uri: img }}
                    />
                  </Row>
                  <HStack
                    maxWidth="300px"
                    marginX="auto"
                    space="10px"
                    alignItems="center"
                    justifyContent="center">
                    <Link
                      onPress={() =>
                        navigate('/onboarding-helper-matching/request-matching')
                      }>
                      <CircleIcon
                        size="xs"
                        stroke="primary.900"
                        strokeWidth="2"
                        color="transparent"
                      />
                    </Link>
                    <Link
                      onPress={() =>
                        navigate('/onboarding-helper-matching/request')
                      }>
                      <CircleIcon
                        size="xs"
                        stroke="primary.900"
                        strokeWidth="2"
                        color="transparent"
                      />
                    </Link>
                    <Link
                      onPress={() =>
                        navigate('/onboarding-helper-matching/match')
                      }>
                      <CircleIcon
                        size="xs"
                        stroke="primary.900"
                        strokeWidth="2"
                        color="transparent"
                      />
                    </Link>
                    <Link
                      onPress={() =>
                        navigate('/onboarding-helper-matching/contact')
                      }>
                      <CircleIcon
                        size="xs"
                        stroke="primary.900"
                        strokeWidth="2"
                        color="transparent"
                      />
                    </Link>
                    <Link
                      onPress={() =>
                        navigate('/onboarding-helper-matching/solve-matching')
                      }>
                      <CircleIcon
                        size="xs"
                        stroke="primary.900"
                        strokeWidth="2"
                        color="primary.900"
                      />
                    </Link>
                  </HStack>
                </Box>
                <Box width="100%" marginY={space['1']} alignItems="center">
                  <HStack
                    space={space['1.5']}
                    width="100%"
                    maxWidth="300px"
                    justifyContent="space-between">
                    <Column>
                      <Link
                        onPress={() => setCancelModal(true)}
                        _text={{
                          color: 'primary.400',
                          fontWeight: 600
                        }}
                        textDecoration="underline">
                        {t('onboardingList.skip')}
                      </Link>
                    </Column>
                    <Column>
                      <Link
                        onPress={() =>
                          navigate('/onboarding-helper-matching/finish')
                        }
                        _text={{
                          color: 'primary.900',
                          fontWeight: 600
                        }}
                        textDecoration="underline">
                        {t('onboardingList.next')}
                      </Link>
                    </Column>
                  </HStack>
                </Box>
              </Container>
            </>
          }
        />
        <Modal isOpen={cancelModal} onClose={() => setCancelModal(false)}>
          <OnBoardingSkipModal
            onPressClose={() => setCancelModal(false)}
            onPressDefaultButton={() => setCancelModal(false)}
            onPressOutlineButton={() => navigate('/')}
          />
        </Modal>
      </View>
    </>
  )
}
export default OnBoardingHelperMatchingSolveMatching
