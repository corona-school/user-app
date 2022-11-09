import { gql, useMutation } from '@apollo/client'
import { GraphQLError } from 'graphql'
import {
  VStack,
  Heading,
  Button,
  Flex,
  Box,
  Image,
  useTheme,
  useBreakpointValue
} from 'native-base'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import CenterLoadingSpinner from '../components/CenterLoadingSpinner'
import useApollo from '../hooks/useApollo'
import Logo from '../assets/icons/lernfair/lf-logo.svg'

type Props = {}

const VerifyEmail: React.FC<Props> = () => {
  const { space, sizes } = useTheme()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams?.get('token') || ''
  const { createToken, clearToken } = useApollo()
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginToken, navigate, token])

  useEffect(() => {
    if (token) login()
  }, [login, token])

  useEffect(() => {
    return () => {
      clearToken()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const ContainerWidth = useBreakpointValue({
    base: '90%',
    lg: sizes['formsWidth']
  })

  if (loading) return <CenterLoadingSpinner />

  return (
    <Flex overflowY={'auto'} height="100vh">
      <>
        <Box
          position="relative"
          paddingY={space['2']}
          justifyContent="center"
          alignItems="center">
          <Image
            alt="Lernfair"
            position="absolute"
            zIndex="-1"
            borderBottomRadius={15}
            width="100%"
            height="100%"
            source={{
              uri: require('../assets/images/globals/lf-bg.png')
            }}
          />
          <Logo />
          <Heading mt={space['1']}>E-Mail Verifizierung</Heading>
        </Box>
        <VStack
          space={space['1']}
          paddingX={space['1']}
          mt={space['4']}
          marginX="auto"
          width={ContainerWidth}
          justifyContent="center">
          {(showSuccess && (
            <VStack>
              <Heading>Dein Account wurde aktiviert!</Heading>
              <Button
                onPress={() =>
                  navigate('/additional-data', { state: { token } })
                }>
                Fortfahren
              </Button>
            </VStack>
          )) || <Heading>Token ungültig</Heading>}
        </VStack>
      </>
    </Flex>
  )
}
export default VerifyEmail
