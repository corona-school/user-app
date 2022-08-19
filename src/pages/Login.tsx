import { useCallback, useEffect, useState } from 'react'
import { gql, useMutation } from '@apollo/client'

import {
  Box,
  Button,
  Heading,
  Image,
  Input,
  Link,
  Row,
  Text,
  useTheme,
  View,
  VStack
} from 'native-base'
import useApollo from '../hooks/useApollo'
import { useNavigate } from 'react-router-dom'
import WithNavigation from '../components/WithNavigation'

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

  return (
    <View>
      <VStack>
        <Row flexDirection="column" justifyContent="center" alignItems="center">
          <Box
            bgColor="primary.500"
            width="100%"
            borderBottomRightRadius={15}
            borderBottomLeftRadius={15}
            justifyContent="center"
            paddingY={6}
            marginBottom={6}>
            <Box textAlign="center" justifyContent="center">
              <Image
                marginX="auto"
                size={20}
                source={{
                  uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80'
                }}
              />
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
              />
            </Row>
            <Row marginBottom={3} width="100%">
              <Input
                type="password"
                width="100%"
                isRequired={true}
                placeholder="Passwort"
                onChangeText={setPassword}
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
            <Button onPress={attemptLogin} width="100%">
              Anmelden
            </Button>
          </Box>

          <Box paddingTop={10} paddingBottom={1}>
            <Text>Ich habe doch noch keinen Account:</Text>
            <Link justifyContent="center">Neu registrieren</Link>
          </Box>
        </Row>
      </VStack>
    </View>
  )
}
