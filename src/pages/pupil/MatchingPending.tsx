import { Text, VStack, Heading, Button, Modal, Radio } from 'native-base'
import { useCallback, useState } from 'react'
import CTACard from '../../widgets/CTACard'

type Props = {}

const MatchingPending: React.FC<Props> = () => {
  const [showModal, setShowModal] = useState<boolean>(false)
  const [feedback, setFeedback] = useState<string>()

  const cancelMatchRequest = useCallback((sendFeedback: boolean) => {
    setShowModal(false)
    // TODO cancel
  }, [])

  return (
    <>
      <VStack>
        <Heading>Dein Match</Heading>
        <Text>
          <Text bold>Anfrage vom:</Text> 25.07.2022
        </Text>
        <Text>
          <Text bold>Voraussichtliche Wartezeit:</Text> ca. 1 Monat
        </Text>
        <Text>
          Wir haben deine Anfrage bei uns aufgenommen und sind nun auf der Suche
          nach einem/einer optimalen Lernpartner:in für dich. Sobald wir ein
          Match für dich gefunden haben, wirst du benachrichtigt.
        </Text>
        <Button variant="outline" onPress={() => setShowModal(true)}>
          Anfrage zurücknehmen
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
      <Modal isOpen={showModal}>
        <Modal.Content>
          <Modal.Header>
            <Modal.CloseButton />
          </Modal.Header>
          <Modal.Body>
            <Radio.Group
              name="feedback"
              value={feedback}
              onChange={setFeedback}>
              <Radio value="grade" my={1}>
                Ich habe meine Note erreicht
              </Radio>
              <Radio value="group" my={1}>
                Ich habe einen passenden Gruppenkurs gefunden
              </Radio>
              <Radio value="other" my={1}>
                Sonstiges
              </Radio>
            </Radio.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant={'outline'}
              isDisabled={!feedback}
              onPress={() => cancelMatchRequest(false)}>
              Feedback teilen
            </Button>
            <Button
              variant={'outline'}
              onPress={() => cancelMatchRequest(false)}>
              Keine Angabe machen
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  )
}
export default MatchingPending
