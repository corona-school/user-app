import { Text, VStack, Heading, Box, Button } from 'native-base'
import CTACard from '../../widgets/CTACard'

type Props = {
  onRequestMatch: () => any
}

const MatchingOnboarding: React.FC<Props> = ({ onRequestMatch }) => {
  return (
    <VStack>
      <Heading>Unterstützung anfragen</Heading>
      <Box bgColor="gray.500" h="150px"></Box>
      <Text>
        Du benötigts individuelle Unterstützung? Dann ist die 1:1
        Lernunterstützung genau richtig. Hier kannst du eine:n neue:n Student:in
        anfordern, die dich beim Lernen unterstützt.
      </Text>
      <Text bold>Wichtig</Text>
      <Text>
        Da es bei der 1:1 Lernunterstützung zu langen{' '}
        <Text bold>Wartezeiten von 3 - 6</Text>
        Monaten kommen kann, bieten wir zusätzlich Gruppen-Lernunterstützung an.
      </Text>
      <Button variant="outline" onPress={onRequestMatch}>
        Unterstützung anfragen
      </Button>
      <CTACard
        title="Gruppen-Lernunterstützung"
        content={
          <Text>
            Kurzfristige Unterstützung bei spezifischen Problemen und Fragen
          </Text>
        }
        button={<Button>Zu den Gruppenkursen</Button>}
      />
    </VStack>
  )
}
export default MatchingOnboarding
