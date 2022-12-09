import {
  Box,
  Button,
  Column,
  Heading,
  Text,
  useTheme,
  VStack
} from 'native-base'
import { useCallback, useContext, useState } from 'react'
import IconTagList from '../../../widgets/IconTagList'
import TwoColGrid from '../../../widgets/TwoColGrid'
import { RequestMatchContext } from './Matching'

const Filter: React.FC = () => {
  const { space } = useTheme()
  const { setCurrentIndex } = useContext(RequestMatchContext)
  const [isFit, setIsFit] = useState<'yes' | 'no'>()
  const [isAcceptWaitingTime, setIsAcceptWaitingTime] = useState<'yes' | 'no'>()

  const next = useCallback(() => {
    if (isFit !== 'yes' || isAcceptWaitingTime !== 'yes') {
      // TODO show
      return
    }
    setCurrentIndex(2)
  }, [isAcceptWaitingTime, isFit, setCurrentIndex])

  return (
    <VStack space={space['0.5']}>
      <Heading fontSize="2xl">Die 1:1 Lernunterstützung</Heading>
      <Heading>Für wen ist die 1:1 Lernunterstützung gedacht?</Heading>

      <Text>
        Wenn folgende Punkte auf dich zutreffen, kannst du eine 1:1
        Lernunterstützung bei uns beantragen:
      </Text>

      <Box my={space['0.5']}>
        <Text>● Du brauchst Hilfe in der Schule</Text>
        <Text>
          ● Deine Familie kann dir nicht bei deinen Hausaufgaben helfen
        </Text>
        <Text>● Deine Familie kann keine Nachhilfe für dich bezahlen</Text>
      </Box>

      <Heading fontSize="md">Treffen diese Punkte auf dich zu?</Heading>
      <TwoColGrid>
        <Column>
          <IconTagList
            initial={isFit === 'yes'}
            text="Ja"
            variant="selection"
            onPress={() => setIsFit('yes')}
          />
        </Column>
        <Column>
          <IconTagList
            initial={isFit === 'no'}
            text="Nein"
            variant="selection"
            onPress={() => setIsFit('no')}
          />
        </Column>
      </TwoColGrid>

      <Heading>Lange Wartezeit: 3-6 Monate</Heading>
      <Text>
        Zur Zeit brauchen sehr viele Schüler:innen 1:1-Lernunterstützung.
        Deshalb haben wir eine lange Warteliste. Wahrscheinlich musst du 3-6
        Monate warten, bevor wir dir eine:n Lernpartner:in für dich finden
        können.
      </Text>

      <Heading fontSize="md">Bist du bereit 3-6 Monate zu warten?</Heading>
      <TwoColGrid>
        <Column>
          <IconTagList
            initial={isAcceptWaitingTime === 'yes'}
            text="Ja"
            variant="selection"
            onPress={() => setIsAcceptWaitingTime('yes')}
          />
        </Column>
        <Column>
          <IconTagList
            initial={isAcceptWaitingTime === 'no'}
            text="Nein"
            variant="selection"
            onPress={() => setIsAcceptWaitingTime('no')}
          />
        </Column>
      </TwoColGrid>

      <Button onPress={next}>Weiter</Button>
    </VStack>
  )
}
export default Filter
