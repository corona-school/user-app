import {
  View,
  Text,
  VStack,
  Heading,
  Button,
  useTheme,
  TextArea
} from 'native-base'
import { useCallback, useContext } from 'react'
import { LFSubject } from '../../../types/lernfair/Subject'
import { RequestMatchContext } from './Matching'

type Props = {}

const Details: React.FC<Props> = () => {
  const { space } = useTheme()
  const { matching, setMatching } = useContext(RequestMatchContext)

  const requestMatch = useCallback(() => {
    const subs: LFSubject[] = []
    for (const sub of matching.subjects) {
      const data = { name: sub.label } as { name: string; mandatory?: boolean }

      if (matching.priority === sub) {
        data.mandatory = true
      }

      subs.push(data)
    }
  }, [matching.priority, matching.subjects])

  return (
    <VStack paddingX={space['1']} space={space['0.5']}>
      <Heading fontSize="2xl">Details</Heading>
      <Heading>
        Möchtest du noch etwas an deine:n zuküftigen Lernpartner:in loswerden?
      </Heading>

      <Text>
        Hier kannst du weitere Angaben zu dir oder deiner aktuellen Situation
        machen, z.B. hast du ein spezielles Thema bei dem du Hilfe benötigst
        oder gibt es etwas, was deine Lernpartner:in über dich wissen sollte?
        Wir leiten diesen Text an deine:n zukünftige:n Lernpartner:in weiter.
      </Text>

      <Heading fontSize="md" mt={space['1']}>
        Deine Angaben
      </Heading>
      <TextArea
        placeholder="Was sollte dein:e zukünftige:r Lernpartner:in über dich wissen?"
        autoCompleteType={'off'}
        value={matching.message}
        onChangeText={text => setMatching(prev => ({ ...prev, message: text }))}
      />
      <Button onPress={requestMatch}>Weiter</Button>
    </VStack>
  )
}
export default Details
