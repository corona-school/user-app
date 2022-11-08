import { Text, VStack, useTheme, Heading } from 'native-base'
import { ReactNode } from 'react'
import Card from '../components/Card'
import CSSWrapper from '../components/CSSWrapper'

export type IInstructionMessage = {
  title?: string
  text: ReactNode
  isDark?: boolean
}

const InstructionMessage: React.FC<IInstructionMessage> = ({
  title,
  text,
  isDark
}) => {
  const { space } = useTheme()
  return (
    <VStack>
      <Heading
        fontSize="md"
        color={isDark ? 'lightText' : 'primary.400'}
        marginY={space['1']}
        bold>
        {title}
      </Heading>
      <Text color={isDark ? 'lightText' : 'primary.400'}>{text}</Text>
    </VStack>
  )
}
export default InstructionMessage
