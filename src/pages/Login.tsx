import { useCallback, useEffect, useState } from 'react'
import { gql, useMutation } from '@apollo/client'

import { Button, Input, Text, useTheme, View, VStack } from 'native-base'
import useApollo from '../hooks/useApollo'
import { useNavigate } from 'react-router-dom'

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
      navigate(0)
    } else {
      clearToken()
    }
  }, [clearToken, data, loading, navigate, setToken])

  return (
    <VStack space={space['0.5']}>
      <Input placeholder="Email-Addresse" onChangeText={setEmail} />
      <Input placeholder="Password" onChangeText={setPassword} />
      <Button variant={'outline'} onPress={attemptLogin}>
        Einloggen
      </Button>
      <Button onPress={null}>Neu registrieren</Button>
      {error && (
        <Text>
          Ihre Login-Daten stimmen nicht mit unseren Informationen überein.
          Bitte überprüfe deine Angaben
        </Text>
      )}
    </VStack>
  )
}
