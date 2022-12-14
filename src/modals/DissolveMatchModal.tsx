import { Button, Modal, Radio, Row, useTheme, VStack } from 'native-base'
import { useState } from 'react'

type DissolveModalProps = {
  showDissolveModal: boolean | undefined
  onPressDissolve: (dissolveReason: string) => any
  onPressBack: () => any
}

const DissolveMatchModal: React.FC<DissolveModalProps> = ({
  showDissolveModal,
  onPressDissolve,
  onPressBack
}) => {
  const { space } = useTheme()

  const [reason, setReason] = useState<string>('')

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
              <Radio value={'1'}>
                Lernpartner:in hat seine/ihre Note erreicht
              </Radio>
              <Radio value={'2'}>Termine wurden nicht eingehalten</Radio>
              <Radio value={'3'}>Sonstiges</Radio>
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
            <Button onPress={onPressBack}>Zurück</Button>
          </Row>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  )
}

export default DissolveMatchModal
