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
import { useNavigate } from 'react-router-dom'
import IconTagList from '../../../widgets/IconTagList'
import TwoColGrid from '../../../widgets/TwoColGrid'
import { RequestMatchContext } from './RequestMatch'

const Filter: React.FC = () => {
  const { space } = useTheme()
  const navigate = useNavigate()
  const { setCurrentIndex: goToIndex } = useContext(RequestMatchContext)
  const [isFit, setIsFit] = useState<'yes' | 'no'>()
  const [isAcceptWaitingTime, setIsAcceptWaitingTime] = useState<'yes' | 'no'>()
  const [currentIndex, setCurrentIndex] = useState<number>(0)

  const next = useCallback(() => {
    if (isFit !== 'yes' || isAcceptWaitingTime !== 'yes') {
      setCurrentIndex(1)
      return
    }
    goToIndex(1)
  }, [goToIndex, isAcceptWaitingTime, isFit])

  return (
    <VStack>
      {currentIndex === 0 && (
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

          <Button onPress={next} isDisabled={!isFit || !isAcceptWaitingTime}>
            Weiter
          </Button>
        </VStack>
      )}
      {currentIndex === 1 && (
        <VStack space={space['0.5']}>
          <Heading fontSize="2xl">Alternative Angebote</Heading>

          <Text>
            Leider können wir dich derzeit nicht mit einem:r Lernpartner:in
            versorgen.
          </Text>

          <Heading fontSize="md" mt={space['1']}>
            Kennst du schon unsere Gruppenkurse?
          </Heading>

          <Text>
            Vielleicht ist hier etwas Passendes für dich dabei. Es lohnt sich
            öfter vorbeizuschauen, denn wir laden regelmäßig neue Kurse hoch.
            Alternativ kannst du dich auf edu-cloud.org umsehen. Dort findest du
            viele andere digitale Plattformen, die dich beim Lernen unterstützen
            können.
          </Text>

          <Text>Bei Fragen kannst du dich gerne jederzeit bei uns melden.</Text>

          <Button onPress={() => navigate('/group')}>
            Zu den Gruppenkursen
          </Button>
          <Button
            variant="outline"
            onPress={() => window.open('https://edu-cloud.org', '_blank')}>
            Zu Edu-Cloud
          </Button>
        </VStack>
      )}
    </VStack>
  )
}
export default Filter
