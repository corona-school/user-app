import { Button, Flex, Heading, Text, useTheme, VStack } from 'native-base'
import { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Questionnaire, { Answer } from '../../components/Questionnaire'
import useApollo from '../../hooks/useApollo'
import questions from './questions'
import EventIcon from '../../assets/icons/lernfair/ic_event.svg'
import useModal from '../../hooks/useModal'
import { gql, useMutation } from '@apollo/client'
import useRegistration from '../../hooks/useRegistration'

type Props = {}

const RegistrationData: React.FC<Props> = () => {
  const { space } = useTheme()
  const navigate = useNavigate()

  const { setShow, setContent, setVariant } = useModal()
  const { firstname, lastname, email, password } = useRegistration()

  const [register, { data, error, loading }] = useMutation(gql`
    mutation register(
      $firstname: String!
      $lastname: String!
      $email: String!
    ) {
      meRegisterStudent(
        data: {
          firstname: $firstname
          lastname: $lastname
          email: $email
          newsletter: false
          registrationSource: normal
          redirectTo: null
        }
      ) {
        id
      }
    }
  `)

  const [setPassword, { data: pwData, error: pwError, loading: pwLoading }] =
    useMutation(
      gql`
        mutation setPassword($password: String!) {
          passwordCreate(password: $password)
        }
      `
    )

  const registerStudent = useCallback(async () => {
    await register({ variables: { firstname, lastname, email } })
  }, [email, firstname, lastname, register])

  const onQuestionnaireFinished = useCallback(
    async (answers: { [key: string]: Answer }) => {
      await registerStudent()
    },
    [registerStudent]
  )

  useEffect(() => {
    if (pwData && pwData.passwordCreate) {
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
  }, [navigate, pwData, setContent, setShow, setVariant, space])

  useEffect(() => {
    if (error || pwError) {
      setVariant('dark')
      setContent(
        <VStack space={space['1']} p={space['1']} flex="1" alignItems="center">
          <Text color="lightText">Es ist ein Fehler aufgetreten</Text>
          <Button onPress={() => setShow(false)}>Zurück</Button>
        </VStack>
      )
      setShow(true)
    }
  }, [error, pwError, setContent, setShow, setVariant, space])

  useEffect(() => {
    if (data) {
      setPassword({ variables: { password } })
    }
  }, [data, password, setPassword])

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
