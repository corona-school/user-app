import { gql, useMutation } from '@apollo/client'
import { View, Text } from 'native-base'
import { useCallback, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import CenterLoadingSpinner from '../components/CenterLoadingSpinner'
import useApollo from '../hooks/useApollo'

type Props = {}

const LoginToken: React.FC<Props> = () => {
  const navigate = useNavigate()
  const { createDeviceToken } = useApollo()
  const [searchParams] = useSearchParams()
  const token = searchParams?.get('secret_token')
  const redirectTo = searchParams?.get('redirectTo')

  const [loginToken] = useMutation(gql`
    mutation ($token: String!) {
      loginToken(token: $token)
    }
  `)

  const login = useCallback(async () => {
    const res = await loginToken({ variables: { token } })
    if (res.data?.loginToken) {
      await createDeviceToken()
      navigate(redirectTo || '/start')
    } else {
      navigate('/login')
    }
  }, [createDeviceToken, loginToken, navigate, redirectTo, token])

  useEffect(() => {
    login()
  }, [login])

  return <CenterLoadingSpinner />
}
export default LoginToken
