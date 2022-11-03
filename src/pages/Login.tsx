import { useCallback, useEffect, useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import Logo from '../assets/icons/lernfair/lf-logo.svg'

import {
  Box,
  Button,
  Heading,
  Image,
  Input,
  Link,
  Pressable,
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

export default function Login() {
  const { t } = useTranslation()
  const { space, sizes } = useTheme()
  const [email, setEmail] = useState<string>()
  const [password, setPassword] = useState<string>()

  const [login, { data, error, loading }] = useMutation(gql`
    mutation login($password: String!, $email: String!) {
      loginPassword(password: $password, email: $email)
    }
  `)

  const { clearToken, createToken } = useApollo()
  const navigate = useNavigate()
  const { trackPageView, trackEvent } = useMatomo()

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
    createToken()
    loginButton()
    await login({
      variables: {
        email: email,
        password: password
      }
    })
  }, [createToken, email, login, loginButton, password])

  useEffect(() => {
    if (loading) return
    if (data && data.loginPassword) {
      navigate('/')
    } else {
      clearToken()
    }
  }, [clearToken, data, loading, navigate])

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>
  ) => {
    if (e.nativeEvent.key === 'Enter') {
      attemptLogin()
    }
  }

  const ContainerWidth = useBreakpointValue({
    base: '90%',
    lg: sizes['smallWidth']
  })

  return (
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
          <Text opacity={0.6} fontSize="xs">
            {t('login.hint.mandatory')}
          </Text>
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

        <Button marginY={4} variant="link">
          {t('login.btn.password')}
        </Button>

        <Box paddingTop={4} marginX="90px" display="block">
          <Button onPress={attemptLogin} width="100%" isDisabled={loading}>
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
  )
}
