import { Box, Button, Column, Row, useTheme, VStack } from 'native-base'
import { useCallback, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import TextInput from '../../components/TextInput'
import PasswordInput from '../../components/PasswordInput'
import AlertMessage from '../../widgets/AlertMessage'
import { useMatomo } from '@jonkoops/matomo-tracker-react'
import { gql, useMutation } from '@apollo/client'
import { RegistrationContext } from '../Registration'
import { useNavigate } from 'react-router-dom'

const PersonalData: React.FC = () => {
  const {
    userType,
    setCurrentIndex,
    firstname,
    setFirstname,
    lastname,
    setLastname,
    email,
    setEmail,
    password,
    setPassword,
    passwordRepeat,
    setPasswordRepeat
  } = useContext(RegistrationContext)

  const { t } = useTranslation()
  const navigate = useNavigate()
  const { space } = useTheme()
  const { trackEvent } = useMatomo()

  const [showEmailNotAvailable, setShowEmailNotAvailable] =
    useState<boolean>(false)
  const [showNameMissing, setShowNameMissing] = useState<boolean>(false)
  const [showEmailValidate, setEmailValidate] = useState<boolean>(false)
  const [showPasswordLength, setShowPasswordLength] = useState<boolean>(false)
  const [showPasswordConfirmNoMatch, setShowPasswordConfirmNoMatch] =
    useState<boolean>(false)

  const [isEmailAvailable] = useMutation(gql`
    mutation isEmailAvailable($email: String!) {
      isEmailAvailable(email: $email)
    }
  `)

  const isInputValid = useCallback(() => {
    setShowNameMissing(!firstname || !lastname)
    setShowPasswordLength(password.length < 6)
    setShowPasswordConfirmNoMatch(password !== passwordRepeat)
    setEmailValidate(!/\S+@\S+\.\S+/.test(email) || email.length < 6)
    return (
      password.length >= 6 &&
      password === passwordRepeat &&
      email.length >= 6 &&
      /\S+@\S+\.\S+/.test(email) &&
      firstname &&
      lastname
    )
  }, [email, firstname, lastname, password, passwordRepeat])

  const checkEmail = useCallback(async () => {
    if (!isInputValid()) return
    const validMail = email.toLowerCase()
    const res = await isEmailAvailable({ variables: { email: validMail } })

    if (res.data?.isEmailAvailable) {
      trackEvent({
        category: 'kurse',
        action: 'click-event',
        name: 'Registrierung – Account Informationen – Bestätigung',
        documentTitle: 'Registrierung – Seite 1'
      })

      userType === 'pupil' ? setCurrentIndex(2) : setCurrentIndex(5)
    }
    setShowEmailNotAvailable(!res.data?.isEmailAvailable)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, isEmailAvailable, isInputValid])

  return (
    <VStack w="100%" space={space['1']} marginTop={space['1']}>
      <TextInput
        value={firstname}
        placeholder={t('firstname')}
        onChangeText={setFirstname}
      />
      <TextInput
        value={lastname}
        placeholder={t('lastname')}
        onChangeText={setLastname}
      />
      {showNameMissing && (
        <AlertMessage content={t('registration.hint.name')} />
      )}
      <TextInput
        keyboardType="email-address"
        placeholder={t('email')}
        onChangeText={setEmail}
        value={email}
      />
      {showEmailNotAvailable && (
        <AlertMessage content={t('registration.hint.email.unavailable')} />
      )}
      {showEmailValidate && (
        <AlertMessage content={t('registration.hint.email.invalid')} />
      )}
      <PasswordInput
        placeholder={t('password')}
        onChangeText={setPassword}
        value={password}
      />
      {showPasswordLength && (
        <AlertMessage content={t('registration.hint.password.length')} />
      )}
      <PasswordInput
        placeholder={t('registration.password_repeat')}
        onChangeText={setPasswordRepeat}
        value={passwordRepeat}
      />

      {showPasswordConfirmNoMatch && (
        <AlertMessage content={t('registration.hint.password.nomatch')} />
      )}

      <Box alignItems="center" marginTop={space['2']}>
        <Row space={space['1']} justifyContent="center">
          <Column width="100%">
            <Button
              width="100%"
              height="100%"
              variant="ghost"
              colorScheme="blueGray"
              onPress={() => {
                setCurrentIndex(0)
              }}>
              {t('lernfair.buttons.prev')}
            </Button>
          </Column>
          <Column width="100%">
            <Button width="100%" onPress={checkEmail}>
              {t('lernfair.buttons.next')}
            </Button>
          </Column>
        </Row>
      </Box>
    </VStack>
  )
}

export default PersonalData
