import {
  Text,
  VStack,
  Input,
  Heading,
  Checkbox,
  Button,
  useTheme,
  Row,
  Box,
  Flex,
  Image
} from 'native-base'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import ToggleButton from '../../components/ToggleButton'

import StudentIcon from '../../assets/icons/lernfair/ic_student.svg'
import TutorIcon from '../../assets/icons/lernfair/ic_tutor.svg'
import ParentIcon from '../../assets/icons/lernfair/ic_parent.svg'

import WarningIcon from '../../assets/icons/lernfair/ic_warning.svg'
import Logo from '../../assets/icons/lernfair/lf-logo.svg'
import useRegistration from '../../hooks/useRegistration'
import useModal from '../../hooks/useModal'
import useApollo from '../../hooks/useApollo'
import TextInput from '../../components/TextInput'

type Props = {}

const RegistrationAccount: React.FC<Props> = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [legalChecked, setLegalChecked] = useState<boolean>()
  const navigate = useNavigate()
  const { space } = useTheme()
  const { t } = useTranslation()
  const { setContent, setShow, setVariant } = useModal()
  const { setRegistrationData, email, password, userType } = useRegistration()
  const { createToken } = useApollo()

  const [passwordConfirm, setPasswordConfirm] = useState<string>('')

  useEffect(() => {
    createToken()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onBarrierSolved = useCallback(
    (isUserFit: boolean) => {
      // TODO react to barrier result
      setShow(false)
      navigate('/registration/2')
    },
    [navigate, setShow]
  )

  const showModal = useCallback(() => {
    setVariant('dark')
    setContent(() => (
      <VStack space={space['1']} p={space['1']} flex="1" alignItems="center">
        <WarningIcon />
        <Heading color={'lightText'}>{t('registration.barrier.title')}</Heading>
        <Text color={'lightText'}>{t(`registration.barrier.text`)}</Text>
        <VStack>
          {new Array(3).fill(0).map((_, i) => (
            <Text fontSize={'md'} color={'lightText'}>
              {t(`registration.barrier.point_${i}`)}
            </Text>
          ))}
        </VStack>
        <Row w="100%" space={space['1']}>
          <Button onPress={() => onBarrierSolved(true)} flex="1">
            {t('registration.barrier.btn.yes')}
          </Button>
          <Button onPress={() => onBarrierSolved(false)} flex="1">
            {t('registration.barrier.btn.no')}
          </Button>
        </Row>
      </VStack>
    ))
    setShow(true)
  }, [onBarrierSolved, setContent, setShow, setVariant, space, t])

  return (
    <Flex overflowY={'auto'} height="100vh">
      <Box
        position="relative"
        paddingY={space['2']}
        bgColor="primary.500"
        justifyContent="center"
        alignItems="center"
        borderBottomRadius={8}>
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
        <Heading mt={space['1']}>Neu registrieren</Heading>
      </Box>
      <VStack flex="1" paddingX={space['1']} mt={space['1']}>
        <VStack space={space['0.5']}>
          <TextInput
            keyboardType="email-address"
            placeholder={t('email')}
            onChangeText={t => setRegistrationData({ email: t })}
          />
          <TextInput
            placeholder={t('password')}
            type="password"
            onChangeText={t => setRegistrationData({ password: t })}
          />
          <TextInput
            placeholder={t('registration.password_repeat')}
            type="password"
            onChangeText={setPasswordConfirm}
          />
          <Text fontSize="xs" opacity=".6">
            Das Password muss mindestens 6 Zeichen enthalten.
            {/* TODO ADD TRANSLATION */}
          </Text>
        </VStack>
        <VStack space={space['0.5']} marginTop={space['1']}>
          <Heading>{t('registration.i_am')}</Heading>
          {/* <ToggleButton
            Icon={ParentIcon}
            label={t('registration.parent')}
            dataKey="parent"
            isActive={typeSelection === 'parent'}
            onPress={setTypeSelection}
          /> */}
          <ToggleButton
            Icon={StudentIcon}
            label={t('registration.student')}
            dataKey="pupil"
            isActive={userType === 'pupil'}
            onPress={() => setRegistrationData({ userType: 'pupil' })}
          />
          <ToggleButton
            Icon={TutorIcon}
            label={t('registration.tutor')}
            dataKey="tutor"
            isActive={userType === 'tutor'}
            onPress={() => setRegistrationData({ userType: 'tutor' })}
          />
        </VStack>
        <VStack space={space['1']} marginTop={space['1']}>
          <Checkbox value={'legalChecked'} onChange={setLegalChecked}>
            {t('registration.check_legal')}
          </Checkbox>
          <Button
            onPress={showModal}
            isDisabled={
              !legalChecked ||
              !userType ||
              password.length < 6 ||
              password !== passwordConfirm ||
              email.length < 6
            }>
            {t('registration.btn.next')}
          </Button>
          {!userType && (
            <Text color="danger.500">
              Bitte identifiziere deine Rolle
              {/* TODO ADD TRANSLATION */}
            </Text>
          )}
          {email.length < 6 && (
            <Text color="danger.500">
              Ungültige Email-Adresse
              {/* TODO ADD TRANSLATION */}
            </Text>
          )}
          <Text
            color="danger.500"
            opacity={password !== passwordConfirm ? 1 : 0}>
            Die Passwörter stimmen nicht überein
            {/* TODO ADD TRANSLATION */}
          </Text>
        </VStack>
      </VStack>
    </Flex>
  )
}
export default RegistrationAccount
