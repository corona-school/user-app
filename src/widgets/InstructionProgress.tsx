import { View, Text, Row, Box, Circle, Divider, useTheme } from 'native-base'
import HSection from './HSection'
import InstructionMessage, { IInstructionMessage } from './InstructionMessage'

type Instruction = {
  label: string
  title: string
  content: IInstructionMessage[]
}

type Props = {
  instructions: Instruction[]
  currentIndex?: number
}

const InstructionProgress: React.FC<Props> = ({
  instructions,
  currentIndex = 0
}) => {
  const { space, sizes } = useTheme()
  return (
    <View>
      <Row paddingX={space['1']}>
        {instructions.map((instruction, index) => {
          const isLast = index >= instructions.length - 1
          const isActive = index === currentIndex
          return (
            <Row
              key={`instruction-label-${index}`}
              alignItems={'center'}
              flex={isActive ? 1 : 0}
              flexBasis={sizes['6'] + 'px'}
              mr={!isLast ? space['0.5'] : 0}>
              <Circle bg={'gray.400'} size={sizes['1.5']}>
                <Text>{index}</Text>
              </Circle>
              {isActive && (
                <Text bold ml={space['0.5']}>
                  {instruction.label}
                </Text>
              )}
              {isActive && !isLast && (
                <View flex="1" px={space['1']}>
                  <Divider />
                </View>
              )}
            </Row>
          )
        })}
      </Row>
      <HSection title={instructions[currentIndex].title} smallTitle>
        {instructions[currentIndex].content.map((instruction, i) => (
          <InstructionMessage
            key={`instruction-${i}`}
            title={instruction.title}
            text={instruction.text}
          />
        ))}
      </HSection>
    </View>
  )
}
export default InstructionProgress
