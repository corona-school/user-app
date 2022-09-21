import {
  useTheme,
  Text,
  View,
  Box,
  Container,
  Image,
  Modal,
  Row,
  HStack,
  Link,
  CircleIcon,
  Column
} from 'native-base'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import ViewPager from '../../../components/ViewPager'
import WithNavigation from '../../../components/WithNavigation'
import OnBoardingSkipModal from '../../../widgets/OnBoardingSkipModal'

type Props = {}

const OnBoardingHelperProfile: React.FC<Props> = () => {
  const { space } = useTheme()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [cancelModal, setCancelModal] = useState<boolean>(false)
  const img = require('../../../assets/images/onboarding/helper/All_Helfer_Matching_Profil.png')

  return (
    <>
      <View backgroundColor="primary.100" height="100%">
        <WithNavigation
          headerTitle={t('onboardingList.Wizard.helper.profile.title')}
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
                    <Text color="lightText" textAlign="center" maxWidth="288px">
                      {t('onboardingList.Wizard.helper.profile.content')}
                    </Text>
                  </View>
                </Box>
                <Box width="100%" padding={space['1']}>
                  <Row marginBottom={space['1']}>
                    <Image
                      width="100%"
                      height="390px"
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
                      onPress={() => navigate('/onboarding-helper/matching')}>
                      <CircleIcon
                        size="xs"
                        stroke="primary.900"
                        strokeWidth="2"
                        color="transparent"
                      />
                    </Link>
                    <Link onPress={() => navigate('/onboarding-helper/groups')}>
                      <CircleIcon
                        size="xs"
                        stroke="primary.900"
                        strokeWidth="2"
                        color="transparent"
                      />
                    </Link>
                    <Link
                      onPress={() =>
                        navigate('/onboarding-helper/appointment')
                      }>
                      <CircleIcon
                        size="xs"
                        stroke="primary.900"
                        strokeWidth="2"
                        color="transparent"
                      />
                    </Link>
                    <Link
                      onPress={() => navigate('/onboarding-helper/helpcenter')}>
                      <CircleIcon
                        size="xs"
                        stroke="primary.900"
                        strokeWidth="2"
                        color="transparent"
                      />
                    </Link>
                    <Link onPress={() => navigate('/onboarding-helper/profil')}>
                      <CircleIcon
                        size="xs"
                        stroke="primary.900"
                        strokeWidth="2"
                        color="primary.900"
                      />
                    </Link>
                    <Link
                      onPress={() => navigate('/onboarding-helper/settings')}>
                      <CircleIcon
                        size="xs"
                        stroke="primary.900"
                        strokeWidth="2"
                        color="transparent"
                      />
                    </Link>
                    <Link
                      onPress={() =>
                        navigate('/onboarding-helper/notification')
                      }>
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
                        onPress={() => navigate('/onboarding-helper/settings')}
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
export default OnBoardingHelperProfile
