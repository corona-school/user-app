import { Button, Flex, Heading, Text, useTheme, VStack } from 'native-base'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import Questionnaire, { Answer } from '../../components/Questionnaire'
import useApollo from '../../hooks/useApollo'

import { ModalContext } from '../../widgets/FullPageModal'
import questions from './questions'
import EventIcon from '../../assets/icons/lernfair/ic_event.svg'

type Props = {}

const RegistrationData: React.FC<Props> = () => {
  const { space } = useTheme()
  const navigate = useNavigate()
  const { createToken } = useApollo()
  const { setShow, setContent, setVariant } = useContext(ModalContext)
  const onQuestionnaireFinished = (answers: { [key: string]: Answer }) => {
    setVariant('dark')
    setContent(
      <VStack space={space['1']} p={space['1']} flex="1" alignItems="center">
        <EventIcon />
        <Heading color="lightText">Erledigt!</Heading>
        <Text color="lightText" fontSize={'lg'}>
          Dein Account wurde erfoglreich erstellt. Du kannst nun das Angebot von
          Lern-Fair nutzen!
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
