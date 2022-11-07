import { View, Text, Modal, Radio, Row, Button, useTheme } from 'native-base'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

type Props = {
  showModal: boolean
  onClose: () => any
  onShareFeedback: (feedback: string) => any
  onSkipShareFeedback: () => any
}

const CancelMatchRequestModal: React.FC<Props> = ({
  showModal,
  onClose,
  onShareFeedback,
  onSkipShareFeedback
}) => {
  const [feedback, setFeedback] = useState<string>()
  const { space } = useTheme()
  const { t } = useTranslation()

  return (
    <Modal isOpen={showModal} onClose={onClose}>
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>Anfrage zurücknehmen</Modal.Header>
        <Modal.Body>
          <Radio.Group name="feedback" value={feedback} onChange={setFeedback}>
            <Radio value="grade" my={1}>
              {t('matching.pending.modal.radiobuttons.mark')}
            </Radio>
            <Radio value="group" my={1}>
              {t('matching.pending.modal.radiobuttons.groupCourse')}
            </Radio>
            <Radio value="other" my={1}>
              {t('matching.pending.modal.radiobuttons.other')}
            </Radio>
          </Radio.Group>
        </Modal.Body>
        <Modal.Footer>
          <Row space={space['1']}>
            <Button
              isDisabled={!feedback}
              onPress={() => onShareFeedback(feedback!)}>
              {t('matching.pending.modal.buttons.shareFeedback')}
            </Button>
            <Button variant={'outline'} onPress={onSkipShareFeedback}>
              {t('matching.pending.modal.buttons.nothing')}
            </Button>
          </Row>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  )
}
export default CancelMatchRequestModal
