import { gql, useMutation } from '@apollo/client'
import { useMatomo } from '@jonkoops/matomo-tracker-react'
import {
  VStack,
  Heading,
  Button,
  useTheme,
  TextArea,
  Flex,
  Box,
  Image,
  useBreakpointValue,
  Row,
  Text
} from 'native-base'
import { useCallback, useEffect, useMemo } from 'react'

import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import Logo from '../../assets/icons/lernfair/lf-logo.svg'
import TextInput from '../../components/TextInput'
import useModal from '../../hooks/useModal'
import useRegistration from '../../hooks/useRegistration'
import VerifyEmailModal from '../../modals/VerifyEmailModal'
import { DEEPLINK_OPTIN } from '../../Utility'

type Props = {}

const mutPupil = gql`
  mutation register(
    $firstname: String!
    $lastname: String!
    $email: String!
    $password: String!
    $aboutMe: String
  ) {
    meRegisterPupil(
      noEmail: true,
      data: {
        firstname: $firstname
        lastname: $lastname
        email: $email
        newsletter: false
        registrationSource: normal
        state: other
        aboutMe: $aboutMe
      }
    ) {
      id
    }
    passwordCreate(password: $password)
    tokenRequest(action: "user-verify-email", email: $email, redirectTo: "${DEEPLINK_OPTIN}")
  }
`
const mutStudent = gql`
  mutation register(
    $firstname: String!
    $lastname: String!
    $email: String!
    $password: String!
  ) {
    meRegisterStudent(
      noEmail: true,
      data: {
        firstname: $firstname
        lastname: $lastname
        email: $email
        newsletter: false
        registrationSource: normal
        
      }
    ) {
      id
    }
    passwordCreate(password: $password)
    tokenRequest(action: "user-verify-email", email: $email, redirectTo: "${DEEPLINK_OPTIN}")
  }
`

const RegistrationPersonal: React.FC<Props> = () => {
  const { t } = useTranslation()
  const { setVariant, setShow, setContent } = useModal()
  const { space, sizes } = useTheme()
  const { trackPageView } = useMatomo()
  const navigate = useNavigate()
  const {
    setFirstname,
    setLastname,
    setAboutMe,
    email,
    password,
    userType,
    firstname,
    lastname,
    aboutMe
  } = useRegistration()

  const [register, _register] = useMutation(
    userType === 'pupil' ? mutPupil : mutStudent
  )

  useEffect(() => {
    if (!email || !password) navigate('/registration/1')
  }, [email, navigate, password])

  const ContainerWidth = useBreakpointValue({
    base: '90%',
    lg: sizes['formsWidth']
  })

  const buttonWidth = useBreakpointValue({
    base: '100%',
    lg: sizes['desktopbuttonWidth']
  })

  useEffect(() => {
    trackPageView({
      documentTitle: 'Registrierung – Eingabemaske Persönliche Daten'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const attemptRegister = useCallback(async () => {
    setVariant('dark')
    try {
      const res = await register({
        variables: { firstname, lastname, email, password, aboutMe }
      })
      if (!res.errors) {
        setContent(<VerifyEmailModal email={email} />)
      } else {
        setContent(
          <VStack
            space={space['1']}
            p={space['1']}
            flex="1"
            alignItems="center">
            <Text color="lightText">
              {t(`registration.result.error.message.${res.errors[0].message}`, {
                defaultValue: res.errors[0].message
              })}
            </Text>
            <Button
              onPress={() => {
                setShow(false)
                attemptRegister()
              }}>
              Erneut versuchen
            </Button>
            <Button onPress={() => setShow(false)}>
              {t('registration.result.error.btn')}
            </Button>
          </VStack>
        )
      }
    } catch (e: any) {
      setContent(
        <VStack space={space['1']} p={space['1']} flex="1" alignItems="center">
          <Text color="lightText">
            {t(`registration.result.error.message.${e.message}`, {
              defaultValue: e.message
            })}
          </Text>
          <Button
            onPress={() => {
              setShow(false)
              attemptRegister()
            }}>
            Erneut versuchen
          </Button>
          <Button onPress={() => setShow(false)}>
            {t('registration.result.error.btn')}
          </Button>
        </VStack>
      )
    }

    // if (!res.errors) {
    //   if (res.data?.meRegisterPupil?.id) {
    //     // navigate('/registration/3')
    //     // show success message

    //   }
    // } else {
    //   // show error message
    // }
    setShow(true)
  }, [
    register,
    firstname,
    lastname,
    email,
    password,
    aboutMe,
    setVariant,
    setContent,
    space,
    t,
    setShow
  ])

  const isValidInput = useMemo(() => {
    return firstname && lastname && email && password
  }, [email, firstname, lastname, password])

  return (
    <Flex overflowY={'auto'} height="100vh">
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
            uri: require('../../assets/images/globals/lf-bg.png')
          }}
        />
        <Logo />
        <Heading mt={space['1']}>{t('registration.personal.title')}</Heading>
      </Box>
      <VStack
        space={space['1']}
        paddingX={space['1']}
        mt={space['4']}
        marginX="auto"
        width={ContainerWidth}>
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
        {userType === 'pupil' && (
          <>
            <Heading>{t('registration.personal.about.label')}</Heading>
            <TextArea
              h={150}
              value={aboutMe}
              onChangeText={setAboutMe}
              placeholder={t('registration.personal.about.text')}
              autoCompleteType={{}}
            />
          </>
        )}

        <Row justifyContent="center">
          <Button
            isDisabled={!isValidInput || _register?.loading}
            width={buttonWidth}
            onPress={attemptRegister}>
            {t('registration.register')}
          </Button>
        </Row>
      </VStack>
    </Flex>
  )
}
export default RegistrationPersonal
