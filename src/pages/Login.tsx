import { useCallback, useEffect, useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import Logo from '../assets/icons/lernfair/lf-logo.svg'

import {
  Box,
  Button,
  Heading,
  Image,
  Modal,
  Row,
  Text,
  useBreakpointValue,
  useTheme,
  VStack
} from 'native-base'
import useApollo from '../hooks/useApollo'
import { useNavigate } from 'react-router-dom'
import { NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native'
import { useTranslation } from 'react-i18next'
import TextInput from '../components/TextInput'
import { useMatomo } from '@jonkoops/matomo-tracker-react'
import PasswordInput from '../components/PasswordInput'
import AlertMessage from '../widgets/AlertMessage'
import { DEEPLINK_LOGIN, DEEPLINK_PASSWORD } from '../Utility'

export default function Login() {
  const { t } = useTranslation()
  const { createDeviceToken } = useApollo()
  const { space, sizes } = useTheme()
  const [showNoAccountModal, setShowNoAccountModal] = useState(false)
  const [email, setEmail] = useState<string>()
  const [showEmailSent, setShowEmailSent] = useState(false)
  const [loginEmail, setLoginEmail] = useState<string>()
  const [password, setPassword] = useState<string>()
  const [showPasswordField, setShowPasswordField] = useState<boolean>(false)
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false)
  const [showPasswordResetResult, setShowPasswordResetResult] = useState<
    'success' | 'error' | 'unknown' | undefined
  >()
  const [login, { error, loading }] = useMutation(gql`
    mutation login($password: String!, $email: String!) {
      loginPassword(password: $password, email: $email)
    }
  `)

  const navigate = useNavigate()
  const { trackPageView, trackEvent } = useMatomo()

  const [determineLoginOptions, _determineLoginOptions] = useMutation(
    gql`
      mutation determineLoginOptions($email: String!) {
        userDetermineLoginOptions(email: $email)
      }
    `
  )

  useEffect(() => {
    trackPageView({
      documentTitle: 'Login'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loginButton = useCallback(() => {
    trackEvent({
      category: 'login',
      action: 'click-event',
      name: 'Login Button auf Login Page',
      documentTitle: 'Login Page'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loginRegisterLink = useCallback(() => {
    trackEvent({
      category: 'login',
      action: 'click-event',
      name: 'Registrierung auf Login Page',
      documentTitle: 'Login Page – Registrierung Link'
    })
    navigate('/registration/1')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate])

  const attemptLogin = useCallback(async () => {
    loginButton()
    const res = await login({
      variables: {
        email: email,
        password: password
      }
    })
    if (res?.data && res.data.loginPassword) {
      await createDeviceToken() // fire and forget
      navigate('/')
    }
  }, [createDeviceToken, email, login, loginButton, navigate, password])

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>
  ) => {
    if (e.nativeEvent.key === 'Enter') {
      getLoginOption()
    }
  }

  const ContainerWidth = useBreakpointValue({
    base: '90%',
    lg: sizes['smallWidth']
  })

  const [resetPW, _resetPW] = useMutation(gql`
    mutation ($email: String!) {
      tokenRequest(email: $email, action: "user-password-reset", redirectTo: "${DEEPLINK_PASSWORD}")
    }
  `)
  const [sendToken, _sendToken] = useMutation(gql`
    mutation ($email: String!) {
      tokenRequest(email: $email, action: "user-authenticate", redirectTo: "${DEEPLINK_LOGIN}")
    }
  `)

  const resetPassword = async (pw: string) => {
    try {
      const res = await resetPW({
        variables: {
          email: pw
        }
      })

      if (res.data.tokenRequest) {
        setShowPasswordResetResult('success')
      } else if (res.errors) {
        if (res.errors[0].message.includes('Unknown User')) {
          setShowPasswordResetResult('unknown')
        } else {
          setShowPasswordResetResult('error')
        }
      }
    } catch (e: any) {
      if (e.message.includes('Unknown User')) {
        setShowPasswordResetResult('unknown')
      } else {
        setShowPasswordResetResult('unknown')
      }
    } finally {
      setShowPasswordModal(false)
    }
  }

  const PasswordModal: React.FC<{ showModal: boolean; email: string }> = ({
    showModal,
    email
  }) => {
    const [pwEmail, setPwEmail] = useState<string>(email)

    return (
      <Modal isOpen={showModal} onClose={() => setShowPasswordModal(false)}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Passwort zurücksetzen</Modal.Header>
          <Modal.Body>
            <VStack space={space['0.5']}>
              <Text>Möchtest du dein Passwort wirklich zurücksetzen?</Text>

              <TextInput
                type="text"
                value={pwEmail}
                placeholder={t('email')}
                onChangeText={setPwEmail}
              />
            </VStack>
          </Modal.Body>
          <Modal.Footer>
            <Row space={space['0.5']}>
              <Button
                isDisabled={pwEmail.length < 6 || _resetPW?.loading}
                onPress={() => resetPassword(pwEmail)}>
                Passwort zurücksetzen
              </Button>
            </Row>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    )
  }

  const NoAccountModal: React.FC<{
    email: string
    showModal: boolean
  }> = ({ email, showModal }) => {
    return (
      <Modal isOpen={showModal} onClose={() => setShowNoAccountModal(false)}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Login</Modal.Header>
          <Modal.Body>
            <VStack space={space['0.5']}>
              <Text>
                Es konnte kein Account mit der E-Mail Adresse{' '}
                <Text bold>{email}</Text> gefunden werden
              </Text>
            </VStack>
          </Modal.Body>
          <Modal.Footer>
            <Row space={space['0.5']}>
              <Button onPress={() => setShowNoAccountModal(false)}>OK</Button>
            </Row>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    )
  }

  const requestToken = useCallback(async () => {
    const res = await sendToken({
      variables: {
        email: email
      }
    })

    if (res.data.tokenRequest) {
      setShowEmailSent(true)
    } else if (res.errors) {
      if (res.errors[0].message.includes('Unknown User')) {
        setShowNoAccountModal(true)
      } else {
        setShowEmailSent(true)
      }
    }
  }, [email, sendToken])

  const getLoginOption = useCallback(async () => {
    if (!email || email.length < 6) return
    const res = await determineLoginOptions({ variables: { email } })
    if (res.data.userDetermineLoginOptions === 'password') {
      setShowPasswordField(true)
      setLoginEmail(email)
    } else if (res.data.userDetermineLoginOptions === 'email') {
      requestToken()
    } else {
      setShowNoAccountModal(true)
    }
  }, [determineLoginOptions, email, requestToken])

  useEffect(() => {
    if (loginEmail) {
      if (loginEmail !== email) {
        setPassword('')
        setShowPasswordField(false)
      }
    }
  }, [email, loginEmail])

  return (
    <>
      <VStack overflowY={'auto'} height="100vh">
        <Row flexDirection="column" justifyContent="center" alignItems="center">
          <Box
            position="relative"
            width="100%"
            justifyContent="center"
            paddingY={6}
            marginBottom={space['5']}>
            <Image
              alt="Lernfair"
              position="absolute"
              zIndex="-1"
              borderBottomRightRadius={15}
              borderBottomLeftRadius={15}
              width="100%"
              height="100%"
              source={{
                uri: require('../assets/images/globals/lf-bg.png')
              }}
            />
            <Box textAlign="center" alignItems="center" justifyContent="center">
              <Logo />
            </Box>
            <Heading
              width="100%"
              textAlign="center"
              paddingTop={space['1.5']}
              paddingBottom={space['0.5']}>
              {t('login.title')}
            </Heading>
          </Box>

          <Box marginX="90px" maxWidth={ContainerWidth} width="100%">
            <Row marginBottom={3}>
              <TextInput
                width="100%"
                isRequired={true}
                placeholder={t('email')}
                onChangeText={setEmail}
                onKeyPress={handleKeyPress}
              />
            </Row>
            {showEmailSent && <AlertMessage content={t('login.email.sent')} />}
            {showPasswordField && (
              <Row marginBottom={3}>
                <PasswordInput
                  width="100%"
                  type="password"
                  isRequired={true}
                  placeholder={t('password')}
                  onChangeText={setPassword}
                  onKeyPress={handleKeyPress}
                />
              </Row>
            )}
          </Box>
          {error && (
            <Text
              paddingTop={4}
              color="danger.700"
              maxWidth={360}
              bold
              textAlign="center">
              {t('login.error')}
            </Text>
          )}

          {showPasswordResetResult && (
            <Box maxWidth={ContainerWidth} width="100%">
              <AlertMessage
                content={
                  showPasswordResetResult === 'success'
                    ? 'Bitte checke deine E-Mails um dein Passwort zurückzusetzen'
                    : showPasswordResetResult === 'error'
                    ? 'Leider konnte dein Passwort nicht zurückgesetzt werden'
                    : 'Für diese E-Mail Adresse ist kein Account registriert'
                }
              />
            </Box>
          )}
          <Button
            marginY={4}
            variant="link"
            onPress={() => setShowPasswordModal(true)}>
            {t('login.btn.password')}
          </Button>

          <Box paddingTop={4} marginX="90px" display="block">
            <Button
              onPress={showPasswordField ? attemptLogin : getLoginOption}
              width="100%"
              isDisabled={
                loading ||
                !email ||
                email.length < 6 ||
                _determineLoginOptions.loading ||
                _sendToken.loading
              }>
              {t('login.btn.login')}
            </Button>
          </Box>

          <Box paddingTop={10} paddingBottom={1}>
            <Text textAlign="center">{t('login.noaccount')}</Text>

            <Button onPress={loginRegisterLink} variant="link">
              {t('login.btn.register')}
            </Button>
          </Box>
        </Row>
      </VStack>
      <PasswordModal showModal={showPasswordModal} email={email || ''} />
      <NoAccountModal showModal={showNoAccountModal} email={email || ''} />
    </>
  )
}
