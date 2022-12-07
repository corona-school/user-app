import {
  Box,
  Button,
  Checkbox,
  ChevronDownIcon,
  ChevronUpIcon,
  Column,
  Flex,
  Heading,
  Image,
  Link,
  Pressable,
  Row,
  Text,
  useBreakpointValue,
  useTheme,
  VStack
} from 'native-base'
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useState
} from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, useNavigate } from 'react-router-dom'
import Logo from '../assets/icons/lernfair/lf-logo.svg'
import useModal from '../hooks/useModal'
import IconTagList from '../widgets/IconTagList'
import TwoColGrid from '../widgets/TwoColGrid'
import WarningIcon from '../assets/icons/lernfair/ic_warning.svg'
import TextInput from '../components/TextInput'
import PasswordInput from '../components/PasswordInput'
import AlertMessage from '../widgets/AlertMessage'
import { useMatomo } from '@jonkoops/matomo-tracker-react'
import { gql, useMutation } from '@apollo/client'
import VerifyEmailModal from '../modals/VerifyEmailModal'
import { REDIRECT_OPTIN } from '../Utility'
import { schooltypes } from '../types/lernfair/SchoolType'
import { states } from '../types/lernfair/State'
import BackButton from '../components/BackButton'

type RegistrationContextType = {
  currentIndex: number
  setCurrentIndex: Dispatch<SetStateAction<number>>
  userType: 'pupil' | 'student'
  setUserType: Dispatch<SetStateAction<'pupil' | 'student'>>
  firstname: string
  setFirstname: Dispatch<SetStateAction<string>>
  lastname: string
  setLastname: Dispatch<SetStateAction<string>>
  email: string
  setEmail: Dispatch<SetStateAction<string>>
  password: string
  setPassword: Dispatch<SetStateAction<string>>
  passwordRepeat: string
  setPasswordRepeat: Dispatch<SetStateAction<string>>
  schoolClass: number
  setSchoolClass: Dispatch<SetStateAction<number>>
  schoolType: string
  setSchoolType: Dispatch<SetStateAction<string>>
  userState: string
  setUserState: Dispatch<SetStateAction<string>>
  newsletter: boolean
  setNewsletter: Dispatch<SetStateAction<boolean>>
}

const RegistrationContext = createContext<RegistrationContextType>(
  {} as RegistrationContextType
)

const mutPupil = gql`
  mutation register(
    $firstname: String!
    $lastname: String!
    $email: String!
    $password: String!
    $newsletter: Boolean!
    $state: State!
    $grade: Int!
    $schoolType: SchoolType!
  ) {
    meRegisterPupil(
      noEmail: true,
      data: {
        firstname: $firstname
        lastname: $lastname
        email: $email
        newsletter: $newsletter
        registrationSource: normal
        state: $state
      }
    ) {
      id
    }
    passwordCreate(password: $password)
    meUpdate(update: { pupil: { gradeAsInt: $grade, schooltype: $schoolType }})
    tokenRequest(action: "user-verify-email", email: $email, redirectTo: "${REDIRECT_OPTIN}")
  }
`
const mutStudent = gql`
  mutation register(
    $firstname: String!
    $lastname: String!
    $email: String!
    $password: String!
    $newsletter: Boolean!
  ) {
    meRegisterStudent(
      noEmail: true,
      data: {
        firstname: $firstname
        lastname: $lastname
        email: $email
        newsletter: $newsletter
        registrationSource: normal
      }
    ) {
      id
    }
    passwordCreate(password: $password)
    tokenRequest(action: "user-verify-email", email: $email, redirectTo: "${REDIRECT_OPTIN}")
  }
`

const NewRegistration: React.FC = () => {
  const { space } = useTheme()
  const { t } = useTranslation()
  const { setVariant, setShow, setContent } = useModal()
  const navigate = useNavigate()

  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [userType, setUserType] = useState<'pupil' | 'student'>('pupil')
  const [firstname, setFirstname] = useState<string>('')
  const [lastname, setLastname] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [passwordRepeat, setPasswordRepeat] = useState<string>('')
  const [schoolType, setSchoolType] = useState<string>('grundschule')
  const [schoolClass, setSchoolClass] = useState<number>(1)
  const [userState, setUserState] = useState<string>('bw')
  const [newsletter, setNewsletter] = useState<boolean>(true)

  const [register] = useMutation(userType === 'pupil' ? mutPupil : mutStudent)

  const attemptRegister = useCallback(async () => {
    setVariant('dark')
    try {
      const validMail = email.toLowerCase()
      const data = {
        variables: {
          firstname,
          lastname,
          email: validMail,
          password,
          newsletter
        }
      } as {
        variables: {
          firstname: string
          lastname: string
          email: string
          password: string
          newsletter: boolean
          schoolType?: string
          grade?: number
          state?: string
        }
      }

      if (userType === 'pupil') {
        data.variables.schoolType = schoolType
        data.variables.grade = schoolClass
        data.variables.state = userState
      }

      const res = await register(data)

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
              {t('registration.result.error.tryagain')}
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
            {t('registration.result.error.tryagain')}
          </Button>
          <Button onPress={() => setShow(false)}>
            {t('registration.result.error.btn')}
          </Button>
        </VStack>
      )
    }
    setShow(true)
  }, [
    setVariant,
    setShow,
    email,
    firstname,
    lastname,
    password,
    newsletter,
    userType,
    register,
    schoolType,
    schoolClass,
    userState,
    setContent,
    space,
    t
  ])

  const goBack = useCallback(() => {
    if (currentIndex === 0) {
      navigate(-1)
    } else {
      if (userType === 'pupil') {
        setCurrentIndex(currentIndex - 1)
      } else {
        if (currentIndex === 5) {
          setCurrentIndex(1)
        } else {
          setCurrentIndex(currentIndex - 1)
        }
      }
    }
  }, [currentIndex, navigate, userType])

  return (
    <Flex alignItems="center" w="100%" h="100vh">
      <Box
        w="100%"
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
        <Box position="absolute" left={space['1']} top={space['1']}>
          <BackButton onPress={goBack} />
        </Box>
        <Logo />
        <Heading mt={space['1']}>{t('registration.register')}</Heading>
      </Box>
      <Flex
        flex="1"
        p={space['1']}
        w="100%"
        alignItems="center"
        overflowY={'scroll'}>
        <RegistrationContext.Provider
          value={{
            currentIndex,
            setCurrentIndex,
            userType,
            setUserType,
            firstname,
            setFirstname,
            lastname,
            setLastname,
            email,
            setEmail,
            password,
            setPassword,
            passwordRepeat,
            setPasswordRepeat,
            schoolClass,
            setSchoolClass,
            schoolType,
            setSchoolType,
            userState,
            setUserState,
            newsletter,
            setNewsletter
          }}>
          <Box w="100%" maxW={'contentContainerWidth'}>
            {currentIndex === 0 && <UserType />}
            {currentIndex === 1 && <PersonalData />}
            {currentIndex === 2 && <SchoolClass />}
            {currentIndex === 3 && <SchoolType />}
            {currentIndex === 4 && <State />}
            {currentIndex === 5 && <Legal onRegister={attemptRegister} />}
          </Box>
        </RegistrationContext.Provider>
      </Flex>
    </Flex>
  )
}
export default NewRegistration

const UserType: React.FC = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { userType, setUserType, setCurrentIndex } =
    useContext(RegistrationContext)
  const { space, sizes } = useTheme()
  const { setContent, setShow, setVariant } = useModal()

  const ModalContainerWidth = useBreakpointValue({
    base: '93%',
    lg: sizes['formsWidth']
  })
  const overflowBar = useBreakpointValue({
    base: 'scroll',
    lg: 'none'
  })

  const onBarrierSolved = useCallback(
    (isUserFit: boolean) => {
      if (isUserFit) {
        setCurrentIndex(1)
      } else {
        navigate('/registration-rejected')
      }
      setShow(false)
    },
    [navigate, setShow, setCurrentIndex]
  )

  const showBarrier = useCallback(() => {
    setVariant('dark')
    setContent(() => (
      <VStack
        space={space['1']}
        p={space['1']}
        flex="1"
        alignItems="center"
        justifyContent="center"
        marginX="auto"
        width={ModalContainerWidth}>
        <Box
          alignItems="center"
          marginY={space['4']}
          overflowY={overflowBar}
          height="100vh">
          <Box marginTop={space['3']} marginBottom={space['1']}>
            <WarningIcon />
          </Box>
          <Heading color={'lightText'} marginBottom={space['1']}>
            {t('registration.barrier.title')}
          </Heading>
          <Text fontSize={'md'} color={'lightText'} textAlign="center">
            {t(`registration.barrier.text`)}
          </Text>
          <VStack paddingBottom={space['2']}>
            {new Array(3).fill(0).map((_, i) => (
              <Text fontSize={'md'} color={'lightText'} textAlign="center">
                {t(`registration.barrier.point_${i}`)}
              </Text>
            ))}
          </VStack>
          <VStack
            width={ModalContainerWidth}
            space={space['1']}
            marginBottom={space['2']}>
            <Button onPress={() => onBarrierSolved(true)} flex="1">
              {t('registration.barrier.btn.yes')}
            </Button>
            <Button
              onPress={() => {
                onBarrierSolved(false)
              }}
              flex="1">
              {t('registration.barrier.btn.no')}
            </Button>
          </VStack>
        </Box>
      </VStack>
    ))
    setShow(true)
  }, [
    ModalContainerWidth,
    onBarrierSolved,
    overflowBar,
    setContent,
    setShow,
    setVariant,
    space,
    t
  ])

  return (
    <VStack w="100%">
      <Heading>Ich bin:</Heading>

      <Box>
        <TwoColGrid>
          <IconTagList
            initial={userType === 'pupil'}
            variant="selection"
            text={t('registration.pupil.label')}
            onPress={() => setUserType('pupil')}
            iconPath={'ic_student.svg'}
          />
          <IconTagList
            initial={userType === 'student'}
            variant="selection"
            text="Helfer:in"
            onPress={() => setUserType('student')}
            iconPath={'ic_tutor.svg'}
          />
        </TwoColGrid>
        <Button
          onPress={() => {
            userType === 'pupil' ? showBarrier() : setCurrentIndex(1)
          }}>
          Weiter
        </Button>
      </Box>
    </VStack>
  )
}

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
    <VStack w="100%" space={space['1']}>
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
      <Button onPress={checkEmail}>Weiter</Button>
    </VStack>
  )
}

const SchoolClass: React.FC = () => {
  const { schoolClass, setSchoolClass, setCurrentIndex } =
    useContext(RegistrationContext)
  const { space } = useTheme()
  const { t } = useTranslation()

  return (
    <VStack flex="1">
      <Heading>In welcher Klasse bist du?</Heading>
      <Row flexWrap="wrap" w="100%" mt={space['1']}>
        {new Array(13).fill(0).map((_, i) => (
          <Column mb={space['0.5']} mr={space['0.5']}>
            <IconTagList
              initial={schoolClass === i + 1}
              textIcon={`${i + 1}`}
              text={t('lernfair.schoolclass', {
                class: i + 1
              })}
              onPress={() => setSchoolClass(i + 1)}
            />
          </Column>
        ))}
      </Row>
      <Button onPress={() => setCurrentIndex(3)}>Weiter</Button>
    </VStack>
  )
}
const SchoolType: React.FC = () => {
  const { schoolType, setSchoolType, setCurrentIndex } =
    useContext(RegistrationContext)
  const { space } = useTheme()
  return (
    <VStack flex="1">
      <Heading>Auf welche Schule gehst du?</Heading>
      <Row flexWrap="wrap" w="100%" mt={space['1']}>
        {schooltypes.map((type, i) => (
          <Column mb={space['0.5']} mr={space['0.5']}>
            <IconTagList
              initial={schoolType === type.key}
              text={type.label}
              onPress={() => setSchoolType(type.key)}
              iconPath={`schooltypes/icon_${type.key}.svg`}
            />
          </Column>
        ))}
      </Row>
      <Button onPress={() => setCurrentIndex(4)}>Weiter</Button>
    </VStack>
  )
}
const State: React.FC = () => {
  const { userState, setUserState, setCurrentIndex } =
    useContext(RegistrationContext)
  const { space } = useTheme()
  return (
    <VStack flex="1">
      <Heading>Aus welchem Bundesland kommst du?</Heading>
      <Row flexWrap="wrap" w="100%" mt={space['1']}>
        {states.map((state, i) => (
          <Column mb={space['0.5']} mr={space['0.5']}>
            <IconTagList
              initial={userState === state.key}
              text={state.label}
              onPress={() => setUserState(state.key)}
              iconPath={`states/icon_${state.key}.svg`}
            />
          </Column>
        ))}
      </Row>
      <Button onPress={() => setCurrentIndex(5)}>Weiter</Button>
    </VStack>
  )
}

const Legal: React.FC<{ onRegister: () => any }> = ({ onRegister }) => {
  const { space } = useTheme()
  const { userType, setNewsletter } = useContext(RegistrationContext)
  const [checks, setChecks] = useState<string[]>([])
  const [errors, setErrors] = useState<{
    dsgvo: boolean
    usa: boolean
    straftaten: boolean
  }>({
    dsgvo: false,
    usa: false,
    straftaten: false
  })

  const isInputValid = useCallback(() => {
    if (userType === 'pupil') {
      setErrors({
        straftaten: true,
        dsgvo: !checks.includes('dsgvo'),
        usa: !checks.includes('usa')
      })
      return checks.includes('dsgvo') && checks.includes('usa')
    } else {
      setErrors({
        dsgvo: !checks.includes('dsgvo'),
        usa: !checks.includes('usa'),
        straftaten: !checks.includes('straftaten')
      })
      return (
        checks.includes('dsgvo') &&
        checks.includes('usa') &&
        checks.includes('straftaten')
      )
    }
  }, [checks, userType])

  const next = useCallback(() => {
    if (isInputValid()) {
      if (checks.includes('newsletter')) {
        setNewsletter(true)
      }
      onRegister()
    }
  }, [checks, isInputValid, onRegister, setNewsletter])

  return (
    <Checkbox.Group onChange={setChecks} value={checks}>
      <VStack>
        <Row>
          <Checkbox value={'dsgvo'} alignItems="flex-start" mr={space['0.5']} />
          <Text>
            Ich habe die <Link>Datenschutzbestimmungen</Link> zur Kenntnis
            genommen und bin damit einverstanden, dass der Lern-Fair e.V. meine
            persönlichen Daten entsprechend des Zwecks, Umfangs und der Dauer
            wie in der Datenschutzerklärung angegeben, verarbeitet und
            gespeichert werden. Mir ist insbesondere bewusst, dass die von mir
            angegebenen Daten zur Durchführung der Angebote an zugeteilte
            Nutzer:innen weitergegeben werden und deren Mailadressen ggf. von
            Anbietern außerhalb der EU zur Verfügung gestellt werden, die die
            Einhaltung des europäischen Datenschutzniveaus nicht gewährleisten
            können. <Required />
          </Text>
        </Row>

        {errors['dsgvo'] && (
          <AlertMessage content="Bitte bestätige die Datenschutzbestimmungen." />
        )}

        <Row alignItems="flex-start" mt={space['1']}>
          <Checkbox value="usa" alignItems="flex-start" mr={space['0.5']} />
          <Accordion
            title="Datenverarbeitung durch Auftragsverarbeiter in den USA"
            required>
            <Text>
              Ich stimme ferner ausdrücklich der Verarbeitung meiner
              personenbezogenen Daten über unsere in den USA sitzenden
              Auftragsverarbeiter Google und Heroku zu, die die Einhaltung des
              europäischen Datenschutzniveaus aufgrund der Möglichkeit von
              Anfragen von US-Nachrichtendiensten nicht gewährleisten können. Zu
              diesem Zweck hat Lern-Fair Standardvertragsklauseln abgeschlossen
              und weitergehende Sicherheitsmaßnahmen vereinbart, Art. 46 Abs. 2
              lit. c DSGVO.
            </Text>
          </Accordion>
        </Row>

        {errors['usa'] && (
          <AlertMessage content="Bitte bestätige die Datenverarbeitung durch Auftragsverarbeiter in den USA." />
        )}

        {userType === 'student' && (
          <>
            <Checkbox
              value="straftaten"
              alignItems="flex-start"
              mt={space['1']}>
              <Text>
                Ich versichere, nicht wegen einer in{' '}
                <Link>§ 72a Abs. 1 Satz 1 SGB VIII</Link> bezeichneten Straftat
                rechtskräftig verurteilt worden zu sein und dass derzeit kein
                Ermittlungsverfahren wegen einer solchen Straftat gegen mich
                läuft. <Required />
              </Text>
            </Checkbox>
            {errors['straftaten'] && (
              <AlertMessage content="Bitte bestätige diese Aussage." />
            )}
          </>
        )}

        <Row mt={space['1']}>
          <Checkbox
            value="newsletter"
            alignItems="flex-start"
            mr={space['0.5']}
          />
          <Text>
            Ich möchte von Lern-Fair über Angebote, Aktionen und weitere
            Unterstützungsmöglichkeiten per E-Mail informiert werden.
          </Text>
        </Row>

        <Text my={space['1']}>
          Hinweis: Für den Fall, dass die einwilligende Person das 18.
          Lebensjahr noch nicht vollendet hat, hat der Träger der elterlichen
          Verantwortung für die Person die Einwilligung zu erklären.
        </Text>

        <Button onPress={next}>Jetzt registrieren</Button>
      </VStack>
    </Checkbox.Group>
  )
}

const Accordion: React.FC<{
  title: string
  children: JSX.Element
  required?: boolean
}> = ({ title, children, required }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <VStack flex="1">
      <Box>
        <Pressable onPress={() => setIsOpen(prev => !prev)}>
          <Row alignItems={'center'} flexWrap="nowrap">
            <Text fontSize="md" mr="2">
              {title}
              {required && (
                <Box ml="1">
                  <Required />
                </Box>
              )}
            </Text>
            {isOpen ? (
              <ChevronUpIcon color="primary.500" />
            ) : (
              <ChevronDownIcon color="primary.500" />
            )}
          </Row>
        </Pressable>
      </Box>

      {isOpen && <Box mt="1">{children}</Box>}
    </VStack>
  )
}

const Required: React.FC = () => <Text color="red.500">*</Text>
