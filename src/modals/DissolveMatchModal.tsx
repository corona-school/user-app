import { Button, Modal, Radio, Row, useTheme, VStack } from 'native-base'
import { useMemo, useState } from 'react'
import { useUserType } from '../hooks/useApollo'

type DissolveModalProps = {
  showDissolveModal: boolean | undefined
  onPressDissolve: (dissolveReason: string) => any
  onPressBack: () => any
}

const studentReasonOptions = {
  1: 'Mein:e Lernpartner:in hat sich nicht zurückgemeldet',
  2: 'Mein:e Lernpartner:in benötigt keine Unterstützung mehr',
  3: 'Ich konnte meinem/meiner Lernpartner:in nicht behilflich sein',
  4: 'Ich habe keine Zeit mehr mein*e Lernpartner:in zu unterstützen',
  5: 'Wir hatten Schwierigkeiten auf zwischenmenschlicher Ebene',
  6: 'Wir konnten keine gemeinsamen Termine finden',
  7: 'Wir hatten technische Schwierigkeiten',
  8: 'Sonstiges',
  9: 'Wir hatten sprachliche Schwierigkeiten'
  // 10: It turned out a user had a criminal record, and their account got cancelled. (don't include as option in frontend)
}

const pupilReasonOptions = {
  1: 'Mein:e Lernpartner:in hat sich nicht zurückgemeldet',
  2: 'Mein:e Lernpartner:in konnte mir nicht behilflich sein',
  3: 'Mein:e Lernpartner:in hat keine Zeit mehr mich zu unterstützen',
  4: 'Ich benötige keine Unterstützung mehr',
  5: 'Wir hatten Schwierigkeiten auf zwischenmenschlicher Ebene',
  6: 'Wir konnten keine gemeinsamen Termine finden',
  7: 'Wir hatten technische Schwierigkeiten',
  8: 'Sonstiges',
  9: 'Wir hatten sprachliche Schwierigkeiten'
  // 10: It turned out a user had a criminal record, and their account got cancelled.
}

const DissolveMatchModal: React.FC<DissolveModalProps> = ({
  showDissolveModal,
  onPressDissolve,
  onPressBack
}) => {
  const { space } = useTheme()
  const userType = useUserType()
  const [reason, setReason] = useState<string>('')

  const reasons = useMemo(
    () =>
      (userType === 'student' && studentReasonOptions) || pupilReasonOptions,
    [userType]
  )
  console.log(reason)
  return (
    <Modal isOpen={showDissolveModal} onClose={onPressBack}>
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>Warum möchtest du das Match auflösen?</Modal.Header>
        <Modal.Body>
          <Radio.Group
            name="dissolve-reason"
            value={reason}
            onChange={setReason}>
            <VStack space={space['1']}>
              {Object.values(reasons).map((reason: string, index: number) => (
                <Radio value={`${index + 1}`}>{reason}</Radio>
              ))}
            </VStack>
          </Radio.Group>
        </Modal.Body>
        <Modal.Footer>
          <Row space={space['1']}>
            <Button
              isDisabled={!reason}
              onPress={() => onPressDissolve(reason)}>
              Match auflösen
            </Button>
            <Button onPress={onPressBack} variant="outline">
              Zurück
            </Button>
          </Row>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  )
}

export default DissolveMatchModal
