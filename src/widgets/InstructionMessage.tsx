import { Text, VStack, useTheme } from 'native-base'
import Card from '../components/Card'

export type IInstructionMessage = {
  title: string
  text: string
}

const InstructionMessage: React.FC<IInstructionMessage> = ({ title, text }) => {
  const { space } = useTheme()
  return (
    <Card>
      <VStack space={space['1']} padding={space['1']}>
        <Text bold>{title}</Text>
        <Text>{text}</Text>
      </VStack>
    </Card>
  )
}
export default InstructionMessage
