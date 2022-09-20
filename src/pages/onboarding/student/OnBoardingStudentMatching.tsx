import {
  useTheme,
  Text,
  View,
  Box,
  Container,
  Image,
  Row,
  CircleIcon,
  Link,
  HStack,
  Column,
  Modal,
  Heading,
  Button
} from 'native-base'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable } from 'react-native'
import { useNavigate } from 'react-router-dom'
import WithNavigation from '../../../components/WithNavigation'
import OnBoardingSkipModal from '../../../widgets/OnBoardingSkipModal'

type Props = {}

const OnBoardingStudentMatching: React.FC<Props> = () => {
  const { space } = useTheme()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [cancelModal, setCancelModal] = useState<boolean>(false)

  const img = require('../../../assets/images/onboarding/onboarding-matching.png')

  return (
    <>
      <View backgroundColor="primary.100" height="100%">
        <WithNavigation
          headerTitle={t('onboardingList.Wizard.students.matching.title')}
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
                      {t('onboardingList.Wizard.students.matching.content')}
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
                    <CircleIcon
                      size="xs"
                      stroke="primary.900"
                      strokeWidth="2"
                      color="primary.900"
                    />
                    <Link>
                      <CircleIcon
                        size="xs"
                        stroke="primary.900"
                        strokeWidth="2"
                        color="transparent"
                      />
                    </Link>
                    <Link>
                      <CircleIcon
                        size="xs"
                        stroke="primary.900"
                        strokeWidth="2"
                        color="transparent"
                      />
                    </Link>
                    <Link>
                      <CircleIcon
                        size="xs"
                        stroke="primary.900"
                        strokeWidth="2"
                        color="transparent"
                      />
                    </Link>
                    <Link>
                      <CircleIcon
                        size="xs"
                        stroke="primary.900"
                        strokeWidth="2"
                        color="transparent"
                      />
                    </Link>
                  </HStack>
                </Box>
                <Box width="100%" marginY={space['1']} alignItems="center">
                  <HStack
                    space={space['1.5']}
                    width="100%"
                    maxWidth="350px"
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
export default OnBoardingStudentMatching
