import {
  useTheme,
  Text,
  View,
  Box,
  Container,
  Image,
  Row,
  Link,
  HStack,
  Column,
  Modal
} from 'native-base'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Bullet from '../../../components/Bullet'
import WithNavigation from '../../../components/WithNavigation'
import OnBoardingSkipModal from '../../../widgets/OnBoardingSkipModal'

type Props = {}

const OnBoardingStudentMatching: React.FC<Props> = () => {
  const { space } = useTheme()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [cancelModal, setCancelModal] = useState<boolean>(false)

  const img = require('../../../assets/images/onboarding/student/All_Schueler_Matching_1_1.png')

  return (
    <>
      <View backgroundColor="primary.100" height="100%">
        <WithNavigation
          isSidebarMenu={false}
          headerTitle={t('onboardingList.Wizard.students.matching.title')}
          headerContent={
            <>
              <Container maxWidth="100%">
                <Box width="100%">
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
                    <Link
                      onPress={() => navigate('/onboarding-students/matching')}>
                      <Bullet isActive={true} />
                    </Link>
                    <Link
                      onPress={() => navigate('/onboarding-students/groups')}>
                      <Bullet />
                    </Link>
                    <Link
                      onPress={() =>
                        navigate('/onboarding-students/appointments')
                      }>
                      <Bullet />
                    </Link>
                    <Link
                      onPress={() =>
                        navigate('/onboarding-students/helpcenter')
                      }>
                      <Bullet />
                    </Link>
                    <Link
                      onPress={() => navigate('/onboarding-students/profil')}>
                      <Bullet />
                    </Link>
                  </HStack>
                </Box>
                <Box width="100%" marginY={space['1']} alignItems="center">
                  <HStack
                    space={space['1.5']}
                    paddingX={space['1']}
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
                        onPress={() => navigate('/onboarding-students/groups')}
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
    </>
  )
}
export default OnBoardingStudentMatching
