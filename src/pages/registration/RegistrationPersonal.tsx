import {
  VStack,
  Input,
  Heading,
  Button,
  useTheme,
  TextArea,
  Flex,
  Box
} from 'native-base'

import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import Logo from '../../assets/icons/lernfair/lf-logo.svg'
import useRegistration from '../../hooks/useRegistration'

type Props = {}

const RegistrationPersonal: React.FC<Props> = () => {
  const { t } = useTranslation()
  const { space } = useTheme()
  const navigate = useNavigate()
  const { setRegistrationData } = useRegistration()

  return (
    <Flex overflowY={'auto'} height="100vh">
      <Box
        paddingY={space['2']}
        bgColor="primary.500"
        justifyContent="center"
        alignItems="center"
        borderBottomRadius={8}>
        <Logo />
        <Heading mt={space['1']}>Neu registrieren</Heading>
      </Box>
      <VStack space={space['1']} paddingX={space['1']} mt={space['1']}>
        <Input
          placeholder={t('firstname')}
          onChangeText={t => setRegistrationData({ firstname: t })}
        />
        <Input
          placeholder={t('lastname')}
          onChangeText={t => setRegistrationData({ lastname: t })}
        />
        <>
          <Heading>Über mich</Heading>
          <TextArea
            h={150}
            placeholder={t(
              'Schreib hier einen kurzen Text zu dir, den andere Nutzer:innen auf deinem Profil sehen können.'
            )}
            autoCompleteType={{}}
          />
        </>
        <Button onPress={() => navigate('/registration/3')}>
          Registrieren
        </Button>
      </VStack>
    </Flex>
  )
}
export default RegistrationPersonal
