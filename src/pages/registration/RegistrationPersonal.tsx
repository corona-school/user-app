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
  Text,
  useBreakpointValue,
  Row
} from 'native-base'
import { useEffect } from 'react'

import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import Logo from '../../assets/icons/lernfair/lf-logo.svg'
import TextInput from '../../components/TextInput'
import useRegistration from '../../hooks/useRegistration'

type Props = {}

const RegistrationPersonal: React.FC<Props> = () => {
  const { t } = useTranslation()
  const { space, sizes } = useTheme()
  const navigate = useNavigate()
  const {
    setRegistrationData,
    email,
    password,
    userType,
    firstname,
    lastname,
    aboutMe
  } = useRegistration()

  useEffect(() => {
    if (!email && !password) navigate('/registration/1')
  }, [email, navigate, password])

  const ContainerWidth = useBreakpointValue({
    base: '90%',
    lg: sizes['formsWidth']
  })

  const buttonWidth = useBreakpointValue({
    base: '100%',
    lg: sizes['desktopbuttonWidth']
  })

  const { trackPageView, trackEvent } = useMatomo()

  useEffect(() => {
    trackPageView({
      documentTitle: 'Registrierung – Eingabemaske Persönliche Daten'
    })
  }, [])

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
          onChangeText={t => setRegistrationData({ firstname: t })}
        />
        <TextInput
          value={lastname}
          placeholder={t('lastname')}
          onChangeText={t => setRegistrationData({ lastname: t })}
        />
        {userType === 'pupil' && (
          <>
            <Heading>{t('registration.personal.about.label')}</Heading>
            <TextArea
              h={150}
              value={aboutMe}
              onChangeText={t => setRegistrationData({ aboutMe: t })}
              placeholder={t('registration.personal.about.text')}
              autoCompleteType={{}}
            />
          </>
        )}

        <Row justifyContent="center">
          <Button
            width={buttonWidth}
            onPress={() => navigate('/registration/3')}>
            {t('registration.register')}
          </Button>
        </Row>
      </VStack>
    </Flex>
  )
}
export default RegistrationPersonal
