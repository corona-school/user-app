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

export default function Login() {
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
            Anmeldung
          </Heading>
        </Box>

        <Box marginX="90px" width="80%">
          <Row marginBottom={3}>
            <Input
              width="100%"
              isRequired={true}
              placeholder="E-Mail"
              onChangeText={setEmail}
              onKeyPress={handleKeyPress}
            />
          </Row>
          <Row marginBottom={3} width="100%">
            <Input
              type="password"
              width="100%"
              isRequired={true}
              placeholder="Passwort"
              onChangeText={setPassword}
              onKeyPress={handleKeyPress}
            />
          </Row>
        </Box>
        {error && (
          <Text
            paddingTop={4}
            color="danger.700"
            maxWidth={360}
            bold
            textAlign="center">
            Ihre Login-Daten stimmen nicht mit unseren Informationen überein.
            Bitte überprüfe deine Angaben
          </Text>
        )}

        <Box paddingY={4}>
          <Link>Passwort vergessen?</Link>
        </Box>
        <Box paddingTop={4} marginX="90px" display="block" width="80%">
          <Button onPress={attemptLogin} width="100%" isDisabled={loading}>
            Anmelden
          </Button>
        </Box>

        <Box paddingTop={10} paddingBottom={1}>
          <Text>Ich habe doch noch keinen Account:</Text>
          <Link justifyContent="center">Neu registrieren</Link>
        </Box>
      </Row>
    </VStack>
  )
}
