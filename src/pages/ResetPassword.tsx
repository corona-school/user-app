import {
  VStack,
  Flex,
  Box,
  useTheme,
  Image,
  Heading,
  Row,
  Button,
  useBreakpointValue,
  Modal
} from 'native-base'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import PasswordInput from '../components/PasswordInput'
import Logo from '../assets/icons/lernfair/lf-logo.svg'
import { gql, useMutation } from '@apollo/client'
import useApollo from '../hooks/useApollo'

type Props = {}

const ResetPassword: React.FC<Props> = () => {
  const { token } = useParams() as { token: string }
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { createToken, clearToken } = useApollo()
  const [password, setPassword] = useState<string>()
  const [passwordRepeat, setPasswordRepeat] = useState<string>()
  const { space, sizes } = useTheme()
  const [showResetPassword, setShowResetPassword] = useState<string>()
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false)
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false)

  const [loginToken] = useMutation(gql`
    mutation ($token: String!) {
      loginToken(token: $token)
    }
  `)

  const [changePassword] = useMutation(gql`
    mutation changePassword($password: String!) {
      passwordCreate(password: $password)
    }
  `)

  const ContainerWidth = useBreakpointValue({
    base: '90%',
    lg: sizes['formsWidth']
  })

  const buttonWidth = useBreakpointValue({
    base: '100%',
    lg: sizes['desktopbuttonWidth']
  })

  const resetPassword = useCallback(async () => {
    const res = await changePassword({ variables: { password } })
    if (res.data.passwordCreate) {
      setShowSuccessModal(true)
    } else {
      setShowErrorModal(true)
    }
  }, [changePassword, password])

  const login = useCallback(async () => {
    try {
      const res = await loginToken({ variables: { token } })
      setShowResetPassword(res?.data?.loginToken ? 'success' : 'error')
    } catch (e) {
      console.log('ERROR', e)
      setShowResetPassword('error')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginToken, token])

  useEffect(() => {
    createToken()
    if (token) {
      login()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [login, loginToken, token])

  const onNext = () => {
    clearToken()
    navigate('/login')
  }

  return (
    <>
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
            <Heading mt={space['1']}>Passwort neu setzen</Heading>
          </Box>
          <VStack
            space={space['1']}
            paddingX={space['1']}
            mt={space['4']}
            marginX="auto"
            width={ContainerWidth}
            justifyContent="center">
            {showResetPassword === 'success' && (
              <>
                <PasswordInput
                  placeholder={t('password')}
                  value={password}
                  onChangeText={setPassword}
                />
                <PasswordInput
                  placeholder={t('registration.password_repeat')}
                  value={passwordRepeat}
                  onChangeText={setPasswordRepeat}
                />

                <Row justifyContent="center">
                  <Button width={buttonWidth} onPress={resetPassword}>
                    Passwort ändern
                  </Button>
                </Row>
              </>
            )}
            {showResetPassword === 'error' && (
              <>
                <Heading>
                  Es ist ein Fehler aufgetreten. Bitte versuche es erneut.
                </Heading>
              </>
            )}
          </VStack>
        </>
      </Flex>
      <Modal isOpen={showSuccessModal} onClose={onNext}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Passwort erfolgreich geändert</Modal.Header>
          <Modal.Body>
            Dein Passwort wurde erfolgreich geändert. Du kannst dich nun mit dem
            neuen Passwort einloggen
          </Modal.Body>
          <Modal.Footer>
            <Row space={space['0.5']}>
              <Button onPress={onNext}>Weiter</Button>
            </Row>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
      <Modal isOpen={showErrorModal} onClose={onNext}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Fehler: Passwort nicht geändert</Modal.Header>
          <Modal.Body>
            Dein Passwort konnte leider nicht geändert werden. Bitte versuche es
            erneut. Sollte der Fehler weiterhin auftreten, schicke eine neue
            E-Mail oder wende dich bitte an den Support.
          </Modal.Body>
          <Modal.Footer>
            <Row space={space['0.5']}>
              <Button onPress={onNext}>Weiter</Button>
            </Row>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  )
}
export default ResetPassword
