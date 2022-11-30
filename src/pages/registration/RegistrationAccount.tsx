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
  ScrollView,
  Link
} from 'native-base'
import { useCallback, useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import ToggleButton from '../../components/ToggleButton'

import PupilIcon from '../../assets/icons/lernfair/ic_student.svg'
import StudentIcon from '../../assets/icons/lernfair/ic_tutor.svg'

import WarningIcon from '../../assets/icons/lernfair/ic_warning.svg'
import Logo from '../../assets/icons/lernfair/lf-logo.svg'
import useRegistration from '../../hooks/useRegistration'
import useModal from '../../hooks/useModal'
import TextInput from '../../components/TextInput'
import { useMatomo } from '@jonkoops/matomo-tracker-react'
import PasswordInput from '../../components/PasswordInput'
import AlertMessage from '../../widgets/AlertMessage'
import { gql, useMutation } from '@apollo/client'

type Props = {}

const RegistrationAccount: React.FC<Props> = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [legalChecked, setLegalChecked] = useState<boolean>()
  const navigate = useNavigate()
  const { space, sizes } = useTheme()
  const { t } = useTranslation()
  const { setContent, setShow, setVariant } = useModal()
  const { email, password, userType, setEmail, setPassword, setUserType } =
    useRegistration()
  // const { createToken } = useApollo()
  const { trackPageView, trackEvent } = useMatomo()

  const [showEmailNotAvailable, setShowEmailNotAvailable] =
    useState<boolean>(false)
  const [showEmailLength, setShowEmailLength] = useState<boolean>(false)
  const [showEmailValidate, setEmailValidate] = useState<boolean>(false)
  const [showPasswordLength, setShowPasswordLength] = useState<boolean>(false)
  const [showUserTypeMissing, setShowUserTypeMissing] = useState<boolean>(false)
  const [showPasswordConfirmNoMatch, setShowPasswordConfirmNoMatch] =
    useState<boolean>(false)
  const [showLegalNotChecked, setShowLegalNotChecked] = useState<boolean>(false)

  const [isEmailAvailable, _isEmailAvailable] = useMutation(gql`
    mutation isEmailAvailable($email: String!) {
      isEmailAvailable(email: $email)
    }
  `)

  const [passwordConfirm, setPasswordConfirm] = useState<string>('')

  const ContainerWidth = useBreakpointValue({
    base: '90%',
    lg: '768px'
  })

  const ModalContainerWidth = useBreakpointValue({
    base: '93%',
    lg: sizes['formsWidth']
  })

  const buttonWidth = useBreakpointValue({
    base: '100%',
    lg: sizes['desktopbuttonWidth']
  })

  const overflowBar = useBreakpointValue({
    base: 'scroll',
    lg: 'none'
  })

  useEffect(() => {
    // createToken()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    trackPageView({
      documentTitle: 'Registrierung'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onBarrierSolved = useCallback(
    (isUserFit: boolean) => {
      if (isUserFit) {
        navigate('/registration/2')
      } else {
        navigate('/registration-rejected')
      }
      setShow(false)
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
        <Box
          alignItems="center"
          marginY={space['4']}
          overflowY={overflowBar}
          height="100vh">
          <Box marginTop={space['3']} marginBottom={space['1']}>
            <WarningIcon />
          </Box>
          <Heading color={'lightText'} marginBottom={space['1']}>
            {t('registration.barrier.title')}
          </Heading>
          <Text fontSize={'md'} color={'lightText'} textAlign="center">
            {t(`registration.barrier.text`)}
          </Text>
          <VStack paddingBottom={space['2']}>
            {new Array(3).fill(0).map((_, i) => (
              <Text fontSize={'md'} color={'lightText'} textAlign="center">
                {t(`registration.barrier.point_${i}`)}
              </Text>
            ))}
          </VStack>
          <VStack
            width={ModalContainerWidth}
            space={space['1']}
            marginBottom={space['2']}>
            <Button onPress={() => onBarrierSolved(true)} flex="1">
              {t('registration.barrier.btn.yes')}
            </Button>
            <Button
              onPress={() => {
                onBarrierSolved(false)
              }}
              flex="1">
              {t('registration.barrier.btn.no')}
            </Button>
          </VStack>
        </Box>
      </VStack>
    ))
    setShow(true)
  }, [
    ModalContainerWidth,
    onBarrierSolved,
    overflowBar,
    setContent,
    setShow,
    setVariant,
    space,
    t
  ])

  const isInputValid = useCallback(() => {
    setShowUserTypeMissing(!userType)
    setShowPasswordLength(password.length < 6)
    setShowPasswordConfirmNoMatch(password !== passwordConfirm)
    setShowEmailLength(email.length < 6)
    setEmailValidate(!/\S+@\S+\.\S+/.test(email))
    setShowLegalNotChecked(!legalChecked)
    return (
      legalChecked &&
      userType &&
      password.length >= 6 &&
      password === passwordConfirm &&
      email.length >= 6
    )
  }, [email, email.length, legalChecked, password, passwordConfirm, userType])

  const checkEmail = useCallback(async () => {
    if (!isInputValid()) return

    const res = await isEmailAvailable({ variables: { email: email } })

    if (res.data?.isEmailAvailable) {
      trackEvent({
        category: 'kurse',
        action: 'click-event',
        name: 'Registrierung – Account Informationen – Bestätigung',
        documentTitle: 'Registrierung – Seite 1'
      })

      userType === 'pupil' ? showModal() : navigate('/registration/2')
    }
    setShowEmailNotAvailable(!res.data?.isEmailAvailable)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, isEmailAvailable, navigate, showModal, userType, isInputValid])

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
              onChangeText={setEmail}
            />
            {showEmailLength && (
              <AlertMessage content={t('registration.hint.email.invalid')} />
            )}
            {showEmailNotAvailable && (
              <AlertMessage
                content={t('registration.hint.email.unavailable')}
              />
            )}
            {showEmailValidate && (
              <AlertMessage content="E-Mail ist nicht richtig angegeben worden." />
            )}

            <PasswordInput
              placeholder={t('password')}
              onChangeText={setPassword}
            />
            <PasswordInput
              placeholder={t('registration.password_repeat')}
              onChangeText={setPasswordConfirm}
            />

            <Text paddingBottom="10px" fontSize="xs" color="primary.grey">
              {t('registration.hint.password.length')}
            </Text>

            {showPasswordLength && (
              <AlertMessage content={t('registration.hint.password.length')} />
            )}
            {showPasswordConfirmNoMatch && (
              <AlertMessage content={t('registration.hint.password.nomatch')} />
            )}
          </VStack>
          <VStack
            space={space['0.5']}
            marginTop={space['1']}
            marginBottom={space['1']}>
            <Heading>{t('registration.i_am')}</Heading>

            <ToggleButton
              Icon={PupilIcon}
              label={t('registration.pupil.label')}
              dataKey="pupil"
              isActive={userType === 'pupil'}
              onPress={(key: string) => {
                setUserType(key)
              }}
            />
            <ToggleButton
              Icon={StudentIcon}
              label={t('registration.student.label')}
              dataKey="student"
              isActive={userType === 'student'}
              onPress={(key: string) => {
                setUserType(key)
              }}
            />
          </VStack>
          {showUserTypeMissing && (
            <AlertMessage content={t('registration.hint.userType.missing')} />
          )}
          <VStack space={space['1']} marginTop={space['1']} flex="1">
            <Checkbox
              value={'legalChecked'}
              onChange={val => {
                setLegalChecked(val)
              }}>
              <Trans i18nKey="registration.check_legal">
                Hiermit stimme ich der
                <Link paddingX={space['0.5']} href="/privacy">
                  Datenschutzerklärung
                </Link>
                zu.
              </Trans>
            </Checkbox>
            {showLegalNotChecked && (
              <AlertMessage
                content={
                  <>
                    <Text>
                      Bitte akzeptiere unsere{' '}
                      <Link href="/privacy">Datenschutzerklärung</Link>
                    </Text>
                  </>
                }
              />
            )}
            <Row justifyContent="center" marginBottom={space['3']}>
              <Button
                width={buttonWidth}
                onPress={checkEmail}
                isDisabled={_isEmailAvailable.loading}>
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
