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
  const { createToken } = useApollo()
  const { setShow, setContent, setVariant } = useModal()
  const { firstname, lastname, email, password } = useRegistration()

  const [register, { data, error, loading }] = useMutation(gql`
    mutation register(
      $firstname: String!
      $lastname: String!
      $email: String!
      $password: String!
    ) {
      meRegisterStudent(
        firstname: $firstname
        lastname: $lastname
        email: $email
        password: $password
        newsletter: false
        registrationSource: normal
        redirectTo: null
      )
    }
  `)

  const registerStudent = useCallback(async () => {
    await register({ variables: { firstname, lastname, email, password } })
  }, [email, firstname, lastname, password, register])

  const onQuestionnaireFinished = useCallback(
    async (answers: { [key: string]: Answer }) => {
      console.log(email, firstname, lastname, password)
      await registerStudent()
    },
    [email, firstname, lastname, password, registerStudent]
  )

  useEffect(() => {
    if (data) {
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
              localStorage.setItem('token', 'meintoken')
              createToken()
              navigate('/dashboard')
              setShow(false)
            }}>
            Zur Anwendung
          </Button>
        </VStack>
      )
      setShow(true)
    }
  }, [createToken, data, navigate, setContent, setShow, setVariant, space])

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
