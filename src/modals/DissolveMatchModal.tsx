import { t } from 'i18next'
import { Button, Modal, Radio, Row, useTheme, VStack } from 'native-base'
import { useMemo, useState } from 'react'
import useLernfair from '../hooks/useLernfair'

type DissolveModalProps = {
  showDissolveModal: boolean | undefined
  onPressDissolve: (dissolveReason: string) => any
  onPressBack: () => any
}

// corresponding dissolve reason ids in translation file
export const studentReasonOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9]
export const pupilReasonOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9]

const DissolveMatchModal: React.FC<DissolveModalProps> = ({
  showDissolveModal,
  onPressDissolve,
  onPressBack
}) => {
  const { space } = useTheme()
  const { userType } = useLernfair()
  const [reason, setReason] = useState<string>('')

  const reasons = useMemo(
    () => (userType === 'student' ? studentReasonOptions : pupilReasonOptions),
    [userType]
  )

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
              {reasons.map((reason: number) => (
                <Radio value={`${reason}`}>
                  {t(`matching.dissolveReasons.${userType}.${reason}`)}
                </Radio>
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
            <Button onPress={onPressBack} variant="ghost">
              Zurück
            </Button>
          </Row>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  )
}

export default DissolveMatchModal
