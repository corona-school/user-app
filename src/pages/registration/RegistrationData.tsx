import { Flex } from 'native-base'
import Questionnaire from '../../components/Questionnaire'
import questions from './questions'

type Props = {}

const RegistrationData: React.FC<Props> = () => {
  return (
    <Flex flex="1">
      <Questionnaire questions={questions} />
    </Flex>
  )
}
export default RegistrationData
