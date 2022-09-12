import { Button, Flex, Heading, Text, useTheme, VStack } from 'native-base'
import { useCallback, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Questionnaire, {
  Answer,
  QuestionnaireContext
} from '../../components/Questionnaire'
import questions from './questions'
import EventIcon from '../../assets/icons/lernfair/ic_event.svg'
import useModal from '../../hooks/useModal'
import { gql, useMutation } from '@apollo/client'
import useRegistration from '../../hooks/useRegistration'
import { useTranslation } from 'react-i18next'

type Props = {}

const RegistrationData: React.FC<Props> = () => {
  const { space } = useTheme()
  const navigate = useNavigate()

  const { t } = useTranslation()
  const { answers } = useContext(QuestionnaireContext)
  const { setShow, setContent, setVariant } = useModal()
  const { firstname, lastname, email, password } = useRegistration()

  const [register, { data, error, loading }] = useMutation(gql`
    mutation register(
      $firstname: String!
      $lastname: String!
      $email: String!
      $schooltype: SchoolType!
      $state: State!
      $password: String!
      $gradeAsInt: Int!
      $subjects: [String!]
    ) {
      meRegisterPupil(
        data: {
          firstname: $firstname
          lastname: $lastname
          email: $email
          newsletter: false
          registrationSource: normal
          redirectTo: null
          schooltype: $schooltype
          state: $state
        }
      ) {
        id
      }
      passwordCreate(password: $password)
      meUpdate(
        update: { pupil: { gradeAsInt: $gradeAsInt, subjects: $subjects } }
      )
    }
  `)

  useEffect(() => {
    if (!firstname && !lastname) navigate('/registration/2')
  }, [email, firstname, lastname, navigate, password])

  const registerPupil = useCallback(
    async (answers: { [key: string]: Answer }) => {
      const state = Object.keys(answers.Bundesland)[0]
      const schooltype = Object.keys(answers.Schulform)[0]

      const gradeAsInt = parseInt(Object.keys(answers.Klasse)[0])
      const subjects = Object.keys(answers.Fächer)

      await register({
        variables: {
          firstname,
          lastname,
          email,
          state,
          schooltype,
          password,
          gradeAsInt,
          subjects
        }
      })
    },
    [email, firstname, lastname, password, register]
  )

  const onQuestionnaireFinished = useCallback(
    async (answers: { [key: string]: Answer }) => {
      await registerPupil(answers)
    },
    [registerPupil]
  )

  useEffect(() => {
    if (data && !error) {
      setVariant('dark')
      setContent(
        <VStack space={space['1']} p={space['1']} flex="1" alignItems="center">
          <EventIcon />
          <Heading color="lightText">Erledigt!</Heading>
          <Text color="lightText" fontSize={'lg'}>
            Dein Account wurde erfolgreich erstellt. Du kannst nun das Angebot
            von Lern-Fair nutzen!
          </Text>
          <Button
            w="100%"
            onPress={() => {
              setShow(false)
              navigate('/login')
            }}>
            Zur Anwendung
          </Button>
        </VStack>
      )
      setShow(true)
    }
  }, [navigate, data, error, setContent, setShow, setVariant, space])

  useEffect(() => {
    if (error) {
      setVariant('dark')
      setContent(
        <VStack space={space['1']} p={space['1']} flex="1" alignItems="center">
          <Text color="lightText">Es ist ein Fehler aufgetreten</Text>
          <Button onPress={() => setShow(false)}>Zurück</Button>
        </VStack>
      )
      setShow(true)
    }
  }, [error, setContent, setShow, setVariant, space])

  return (
    <Flex flex="1">
      <Questionnaire
        questions={questions}
        onQuestionnaireFinished={onQuestionnaireFinished}
      />
    </Flex>
  )
}
export default RegistrationData
