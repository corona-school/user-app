import { useCallback, useEffect, useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import Logo from '../assets/icons/lernfair/lf-logo.svg'

import {
  Box,
  Button,
  Heading,
  Input,
  Link,
  Row,
  Text,
  useTheme,
  VStack
} from 'native-base'
import useApollo from '../hooks/useApollo'
import { useNavigate } from 'react-router-dom'
import { NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native'
import { useTranslation } from 'react-i18next'

export default function Login() {
  const { t } = useTranslation()
  const { space } = useTheme()
  const [email, setEmail] = useState<string>()
  const [password, setPassword] = useState<string>()

  const [login, { data, error, loading }] = useMutation(gql`
    mutation login($password: String!, $email: String!) {
      loginPassword(password: $password, email: $email)
    }
  `)

  const { clearToken, setToken } = useApollo()
  const navigate = useNavigate()

  const attemptLogin = useCallback(async () => {
    await login({
      variables: {
        email: email,
        password: password
      }
    })
  }, [email, login, password])

  useEffect(() => {
    if (loading) return
    if (data && data.loginPassword) {
      navigate('/')
    } else {
      clearToken()
    }
  }, [clearToken, data, loading, navigate, setToken])

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>
  ) => {
    if (e.nativeEvent.key === 'Enter') {
      attemptLogin()
    }
  }

  return (
    <VStack>
      <Row flexDirection="column" justifyContent="center" alignItems="center">
        <Box
          bg="primary.400"
          width="100%"
          borderBottomRightRadius={15}
          borderBottomLeftRadius={15}
          justifyContent="center"
          paddingY={6}
          marginBottom={6}>
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

        <Box marginX="90px" width="80%">
          <Row marginBottom={3}>
            <Input
              width="100%"
              isRequired={true}
              placeholder={t('email')}
              onChangeText={setEmail}
              onKeyPress={handleKeyPress}
            />
          </Row>
          <Row marginBottom={3} width="100%">
            <Input
              type="password"
              width="100%"
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

        <Box paddingY={4}>
          <Link>{t('login.btn.password')}</Link>
        </Box>
        <Box paddingTop={4} marginX="90px" display="block" width="80%">
          <Button onPress={attemptLogin} width="100%" isDisabled={loading}>
            {t('login.btn.login')}
          </Button>
        </Box>

        <Box paddingTop={10} paddingBottom={1}>
          <Text>{t('login.noaccount')}</Text>
          <Link justifyContent="center">{t('login.btn.register')}</Link>
        </Box>
      </Row>
    </VStack>
  )
}
