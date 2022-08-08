import { useEffect } from 'react'
import { gql, useMutation } from '@apollo/client'

import { Button } from 'native-base'
import useApollo from '../hooks/useApollo'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [login, { data, error, loading }] = useMutation(gql`
    mutation login($password: String!, $email: String!) {
      loginPassword(password: $password, email: $email)
    }
  `)

  const { createToken } = useApollo()
  const navigate = useNavigate()

  const attemptLogin = async () => {
    createToken()
    login({
      variables: {
        email: 'croeszies@giftgruen.com',
        password: 'test123'
      }
    })
  }

  useEffect(() => {
    if (data && data.loginPassword) {
      navigate('/')
    }
  }, [data, navigate])

  return (
    <div>
      {error && <div>Falsche Daten! </div>}
      <Button onPress={attemptLogin}></Button>
    </div>
  )
}
