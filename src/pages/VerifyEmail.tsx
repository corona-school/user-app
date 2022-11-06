import { gql, useMutation } from '@apollo/client'
import { GraphQLError } from 'graphql'
import { View, Text, VStack, Heading, Button } from 'native-base'
import { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import CenterLoadingSpinner from '../components/CenterLoadingSpinner'
import useApollo from '../hooks/useApollo'
import login from '../lang/login/de'

type Props = {}

const VerifyEmail: React.FC<Props> = () => {
  const navigate = useNavigate()
  const { token } = useParams() as { token: string }
  const { createToken } = useApollo()
  const [showSuccess, setShowSuccess] = useState<boolean>(false)
  const [loginToken, { loading }] = useMutation(gql`
    mutation ($token: String!) {
      loginToken(token: $token)
    }
  `)

  const login = useCallback(async () => {
    const res = (await loginToken({ variables: { token } })) as {
      errors?: GraphQLError[]
      data?: {
        loginToken?: boolean
      }
    }

    if (!res.errors) {
      if (res.data?.loginToken) {
        createToken(token)
        setShowSuccess(true)
      } else {
        navigate('/login')
      }
    } else {
      navigate('/login')
    }
  }, [createToken, loginToken, navigate, token])

  useEffect(() => {
    if (token) login()
  }, [login, token])

  if (loading) return <CenterLoadingSpinner />

  return (
    <VStack>
      {(showSuccess && (
        <VStack>
          <Heading>Dein Account wurde aktiviert!</Heading>
          <Button onPress={() => navigate('/additional-data')}>
            Fortfahren
          </Button>
        </VStack>
      )) || <Text>Token ungültig</Text>}
    </VStack>
  )
}
export default VerifyEmail
