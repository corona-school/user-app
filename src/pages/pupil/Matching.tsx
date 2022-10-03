import { Text, VStack, Box, Button, Heading, Modal } from 'native-base'
import { useState } from 'react'
import WithNavigation from '../../components/WithNavigation'
import CTACard from '../../widgets/CTACard'
import MatchingOnboarding from './MatchingOnboarding'
import MatchingWizard from './MatchingWizard'

type Props = {}

const Matching: React.FC<Props> = () => {
  const [showModal, setShowModal] = useState<boolean>(false)
  const [currentIndex, setCurrentIndex] = useState<number>(0)

  return (
    <>
      <WithNavigation>
        {currentIndex === 0 && (
          <MatchingOnboarding onRequestMatch={() => setShowModal(true)} />
        )}
        {currentIndex === 1 && <MatchingWizard />}
      </WithNavigation>
      <Modal isOpen={showModal}>
        <Modal.Content>
          <Modal.Header>
            Unterstützung anfragen <Modal.CloseButton />
          </Modal.Header>

          <Modal.Body>
            <VStack>
              <Text>
                Mit unserem Angebot möchten wir vor allem Schüler:innen
                erreichen, die herkömmliche Nachhilfe aufgrund persönlicher,
                sozialer, kultureller oder finanzieller Ressourcen nicht oder
                nur sehr schwer wahrnehmen können. Bitte fordere nur dann eine:n
                neue:n Lernpartner:in an, wenn du keine andere Möglichkeit hast,
                Hilfe zu erhalten.
              </Text>
              <Text bold>Wichtig</Text>
              <Text>
                Da es bei der 1:1 Lernunterstützung zu langen{' '}
                <Text bold>Wartezeiten von 3 - 6 Monaten</Text> kommen kann,
                bieten wir zusätzlich Gruppen-Lernunterstützung an.
              </Text>

              <Button
                onPress={() => {
                  setCurrentIndex(1)
                  setShowModal(false)
                }}>
                Weiter
              </Button>
              <Button variant="outline">Zu den Gruppenkursen</Button>
            </VStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </>
  )
}
export default Matching
