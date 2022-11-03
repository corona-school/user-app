import {
  Text,
  VStack,
  Heading,
  Checkbox,
  Button,
  useTheme,
  Row,
  Box,
  Flex,
  Image,
  useBreakpointValue,
  Alert,
  HStack,
  WarningTwoIcon,
  ScrollView
} from 'native-base'
import { useCallback, useEffect, useState } from 'react'
import { composeInitialProps, useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import ToggleButton from '../../components/ToggleButton'

import PupilIcon from '../../assets/icons/lernfair/ic_student.svg'
import StudentIcon from '../../assets/icons/lernfair/ic_tutor.svg'

import WarningIcon from '../../assets/icons/lernfair/ic_warning.svg'
import Logo from '../../assets/icons/lernfair/lf-logo.svg'
import useRegistration from '../../hooks/useRegistration'
import useModal from '../../hooks/useModal'
import useApollo from '../../hooks/useApollo'
import TextInput from '../../components/TextInput'
import { useMatomo } from '@jonkoops/matomo-tracker-react'

type Props = {}

const RegistrationAccount: React.FC<Props> = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [legalChecked, setLegalChecked] = useState<boolean>()
  const navigate = useNavigate()
  const { space, sizes } = useTheme()
  const { t } = useTranslation()
  const { setContent, setShow, setVariant } = useModal()
  const { setRegistrationData, email, password, userType } = useRegistration()
  const { createToken } = useApollo()

  const [passwordConfirm, setPasswordConfirm] = useState<string>('')

  const ContainerWidth = useBreakpointValue({
    base: '90%',
    lg: '768px'
  })

  const ModalContainerWidth = useBreakpointValue({
    base: '90%',
    lg: sizes['formsWidth']
  })

  const buttonWidth = useBreakpointValue({
    base: '100%',
    lg: sizes['desktopbuttonWidth']
  })

  useEffect(() => {
    createToken()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { trackPageView, trackEvent } = useMatomo()

  useEffect(() => {
    trackPageView({
      documentTitle: 'Registrierung'
    })
  }, [])

  const onBarrierSolved = useCallback(
    (isUserFit: boolean) => {
      // TODO react to barrier result
      setShow(false)
      navigate('/registration/2')
    },
    [navigate, setShow]
  )

  const showModal = useCallback(() => {
    setVariant('dark')
    setContent(() => (
      <VStack
        space={space['1']}
        p={space['1']}
        flex="1"
        alignItems="center"
        justifyContent="center"
        marginX="auto"
        width={ModalContainerWidth}>
        <WarningIcon />
        <Heading color={'lightText'}>{t('registration.barrier.title')}</Heading>
        <Text fontSize={'md'} color={'lightText'}>
          {t(`registration.barrier.text`)}
        </Text>
        <VStack paddingBottom={space['2']}>
          {new Array(3).fill(0).map((_, i) => (
            <Text fontSize={'md'} color={'lightText'}>
              {t(`registration.barrier.point_${i}`)}
            </Text>
          ))}
        </VStack>
        <Row width={ModalContainerWidth} space={space['1']}>
          <Button onPress={() => onBarrierSolved(true)} flex="1">
            {t('registration.barrier.btn.yes')}
          </Button>
          <Button onPress={() => onBarrierSolved(false)} flex="1">
            {t('registration.barrier.btn.no')}
          </Button>
        </Row>
      </VStack>
    ))
    setShow(true)
  }, [
    ModalContainerWidth,
    onBarrierSolved,
    setContent,
    setShow,
    setVariant,
    space,
    t
  ])

  return (
    <ScrollView>
      <Flex paddingBottom={space['1']}>
        <Box
          position="relative"
          paddingY={space['2']}
          bgColor="primary.500"
          justifyContent="center"
          alignItems="center"
          borderBottomRadius={8}>
          <Image
            alt="Lernfair"
            position="absolute"
            zIndex="-1"
            borderBottomRadius={15}
            width="100%"
            height="100%"
            source={{
              uri: require('../../assets/images/globals/lf-bg.png')
            }}
          />
          <Logo />
          <Heading mt={space['1']}>{t('registration.new')}</Heading>
        </Box>
        <VStack
          flex="1"
          paddingX={space['1']}
          mt={space['4']}
          width={ContainerWidth}
          marginX="auto">
          <VStack space={space['0.5']}>
            <TextInput
              keyboardType="email-address"
              placeholder={t('email')}
              onChangeText={t => setRegistrationData({ email: t })}
            />
            {email.length < 6 && (
              <Alert
                alignItems="start"
                marginBottom="10px"
                maxW="350"
                backgroundColor="#fff8f8"
                colorScheme="error">
                <HStack space={2} flexShrink={1} alignItems="center">
                  <WarningTwoIcon color="danger.400" />
                  <Text>{t('registration.hint.email.invalid')}</Text>
                </HStack>
              </Alert>
            )}

            <TextInput
              placeholder={t('password')}
              type="password"
              onChangeText={t => {
                setRegistrationData({ password: t })
              }}
            />
            <TextInput
              placeholder={t('registration.password_repeat')}
              type="password"
              onChangeText={setPasswordConfirm}
            />
            {password !== passwordConfirm ? (
              <Alert
                alignItems="start"
                marginBottom="10px"
                maxW="350"
                backgroundColor="#fff8f8"
                colorScheme="error">
                <HStack space={2} flexShrink={1} alignItems="center">
                  <WarningTwoIcon color="danger.400" />
                  <Text>{t('registration.hint.password.nomatch')}</Text>
                </HStack>
              </Alert>
            ) : (
              ''
            )}

            {password.length < 6 ? (
              <Alert
                alignItems="start"
                marginBottom="10px"
                maxW="400"
                backgroundColor="#fff8f8"
                colorScheme="error">
                <HStack space={2} flexShrink={1} alignItems="center">
                  <WarningTwoIcon color="danger.400" />
                  <Text>{t('registration.hint.password.length')}</Text>
                </HStack>
              </Alert>
            ) : (
              ''
            )}

            <Text fontSize="xs" opacity=".6">
              {t('registration.hint.password.length')}
            </Text>
          </VStack>
          <VStack
            space={space['0.5']}
            marginTop={space['1']}
            marginBottom={space['1']}>
            <Heading>{t('registration.i_am')}</Heading>
            {/* <ToggleButton
            Icon={ParentIcon}
            label={t('registration.parent')}
            dataKey="parent"
            isActive={typeSelection === 'parent'}
            onPress={setTypeSelection}
          /> */}
            <ToggleButton
              Icon={PupilIcon}
              label={t('registration.pupil.label')}
              dataKey="pupil"
              isActive={userType === 'pupil'}
              onPress={() => {
                setRegistrationData({ userType: 'pupil' })
              }}
            />
            <ToggleButton
              Icon={StudentIcon}
              label={t('registration.student.label')}
              dataKey="student"
              isActive={userType === 'student'}
              onPress={() => {
                setRegistrationData({ userType: 'student' })
              }}
            />
          </VStack>
          {!userType && (
            <Alert
              alignItems="start"
              marginBottom="10px"
              maxW="350"
              backgroundColor="#fff8f8"
              colorScheme="warning">
              <HStack space={2} flexShrink={1} alignItems="center">
                <WarningTwoIcon color="danger.400" />
                <Text>{t('registration.hint.userType.missing')}</Text>
              </HStack>
            </Alert>
          )}
          <VStack space={space['1']} marginTop={space['1']} flex="1">
            <Checkbox value={'legalChecked'} onChange={setLegalChecked}>
              {t('registration.check_legal')}
            </Checkbox>
            <Row justifyContent="center" marginBottom={space['3']}>
              <Button
                width={buttonWidth}
                onPress={() => {
                  trackEvent({
                    category: 'kurse',
                    action: 'click-event',
                    name: 'Registrierung – Account Informationen – Bestätigung',
                    documentTitle: 'Registrierung – Seite 1'
                  })

                  userType === 'pupil'
                    ? showModal()
                    : navigate('/registration/2')
                }}
                isDisabled={
                  !legalChecked ||
                  !userType ||
                  password.length < 6 ||
                  password !== passwordConfirm ||
                  email.length < 6
                }>
                {t('registration.btn.next')}
              </Button>
            </Row>
          </VStack>
        </VStack>
        <Flex alignItems="center">
          <Button
            variant={'link'}
            width={buttonWidth}
            onPress={() => navigate('/login')}>
            {t('registration.to_login')}
          </Button>
        </Flex>
      </Flex>
    </ScrollView>
  )
}
export default RegistrationAccount
