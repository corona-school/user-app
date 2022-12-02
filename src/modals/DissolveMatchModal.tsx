import { t } from 'i18next'
import { Button, Modal, Radio, Row, useTheme, VStack } from 'native-base'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useLernfair from '../hooks/useLernfair'

type DissolveModalProps = {
  showDissolveModal: boolean | undefined
  onPressDissolve: (dissolveReason: string) => any
  onPressBack: () => any
}

// corresponding dissolve reason ids in translation file
// for now just loop through 1-9 (+1 in loop)
export const studentReasonOptions = new Array(9).fill(0)
export const pupilReasonOptions = new Array(9).fill(0)

const DissolveMatchModal: React.FC<DissolveModalProps> = ({
  showDissolveModal,
  onPressDissolve,
  onPressBack
}) => {
  const { t } = useTranslation()
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
        <Modal.Header>{t('matching.dissolveModal.title')}</Modal.Header>
        <Modal.Body>
          <Radio.Group
            name="dissolve-reason"
            value={reason}
            onChange={setReason}>
            <VStack space={space['1']}>
              {reasons.map((_: number, index: number) => (
                <Radio value={`${index + 1}`}>
                  {t(`matching.dissolveReasons.${userType}.${index + 1}`)}
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
              {t('matching.dissolveModal.btn')}
            </Button>
            <Button onPress={onPressBack} variant="ghost">
              {t('back')}
            </Button>
          </Row>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  )
}

export default DissolveMatchModal
