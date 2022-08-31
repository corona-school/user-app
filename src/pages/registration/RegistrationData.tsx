import { Flex } from 'native-base'
import Questionnaire, { Answer } from '../../components/Questionnaire'
import questions from './questions'

type Props = {}

const RegistrationData: React.FC<Props> = () => {
  const onQuestionnaireFinished = (answers: { [key: string]: Answer }) => {
    console.log(answers)
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
