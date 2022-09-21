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
import { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import WithNavigation from '../../../components/WithNavigation'
import OnBoardingSkipModal from '../../../widgets/OnBoardingSkipModal'

type Props = {}

const OnBoardingHelperMatch: React.FC<Props> = () => {
  const { space } = useTheme()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [cancelModal, setCancelModal] = useState<boolean>(false)
  const img = require('../../../assets/images/onboarding/helper/All_Helfer_Matching_1_1.png')

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
                    <Text color="lightText" textAlign="center" maxWidth="288px">
                      {t('onboardingList.Wizard.helper.matching.content')}
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
                      onPress={() => navigate('/onboarding-helper/matching')}>
                      <CircleIcon
                        size="xs"
                        stroke="primary.900"
                        strokeWidth="2"
                        color="primary.900"
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
                        navigate('/onboarding-helper/appointments')
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
                        color="transparent"
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
                        onPress={() => navigate('/onboarding-helper/groups')}
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
    </Fragment>
  )
}
export default OnBoardingHelperMatch
