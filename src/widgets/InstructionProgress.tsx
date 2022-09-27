import { View, Text, Row, Circle, Divider, useTheme } from 'native-base'
import HSection from './HSection'
import InstructionMessage, { IInstructionMessage } from './InstructionMessage'

type Instruction = {
  label: string
  title?: string
  content: IInstructionMessage[]
}

type Props = {
  instructions: Instruction[]
  currentIndex?: number
  isDark?: boolean
}

const InstructionProgress: React.FC<Props> = ({
  isDark,
  instructions,
  currentIndex = 0
}) => {
  const { space, sizes } = useTheme()
  return (
    <View>
      <Row>
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
              <Circle
                bg={isActive ? 'primary.400' : 'primary.800'}
                borderColor="primary.grey"
                borderWidth={isActive ? 0 : 1}
                size={sizes['1.5']}>
                <Text bold color={isActive ? 'lightText' : 'primary.grey'}>
                  {index + 1}
                </Text>
              </Circle>
              {isActive && (
                <Text
                  color={isDark ? 'lightText' : 'primary.400'}
                  bold
                  ml={space['0.5']}>
                  {instruction.label}
                </Text>
              )}
              {isActive && !isLast && (
                <View flex="1" px={space['1']}>
                  <Divider
                    borderColor={isActive ? 'lightText' : 'primary.grey'}
                  />
                </View>
              )}
            </Row>
          )
        })}
      </Row>
      <HSection scrollable={false} smallTitle isDark={isDark ? true : false}>
        {instructions[currentIndex].content.map((instruction, i) => (
          <InstructionMessage
            isDark={isDark ? true : false}
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
