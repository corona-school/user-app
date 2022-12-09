import { Button } from 'native-base'
import { useTheme } from 'native-base'
import { View, Text, VStack, Heading, Column } from 'native-base'
import { useContext } from 'react'
import IconTagList from '../../../widgets/IconTagList'
import TwoColGrid from '../../../widgets/TwoColGrid'
import { RequestMatchContext } from './Matching'

const Priority: React.FC = () => {
  const { space } = useTheme()
  const { matching, setMatching, setCurrentIndex } =
    useContext(RequestMatchContext)
  return (
    <VStack paddingX={space['1']} space={space['0.5']}>
      <Heading fontSize="2xl">Priorisierung</Heading>
      <Heading>In welchen Fach brauchst du am meisten Hilfe?</Heading>

      <Text>
        Wir versuchen jemanden für dich zu finden der dir in allen Fächern
        hilft. Das ist aber leider nicht immer möglich. Daher kannst du hier
        angeben, welches Fach dir am wichtigsten ist.
      </Text>

      <TwoColGrid>
        {matching.subjects.map((subject: { label: string; key: string }) => (
          <Column>
            <IconTagList
              initial={matching.priority === subject}
              variant="selection"
              text={subject.label}
              onPress={() => {
                setMatching(prev => ({
                  ...prev,
                  priority: subject
                }))
              }}
            />
          </Column>
        ))}
      </TwoColGrid>
      <Button
        isDisabled={!matching.priority.key}
        onPress={() => setCurrentIndex(6)} // 6 = details
      >
        Weiter
      </Button>
    </VStack>
  )
}
export default Priority
