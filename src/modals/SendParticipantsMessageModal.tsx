import {
  Button,
  FormControl,
  Input,
  Modal,
  Row,
  TextArea,
  useTheme
} from 'native-base'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

type Props = {
  isOpen?: boolean
  isDisabled?: boolean
  onClose?: () => void
  onSend: (subject: string, message: string) => void
}

const SendParticipantsMessageModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSend,
  isDisabled
}) => {
  const { space } = useTheme()
  const [message, setMessage] = useState<string>('')
  const [subject, setSubject] = useState<string>('')
  const { t } = useTranslation()

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>Nachricht senden</Modal.Header>
        <Modal.Body>
          <Row flexDirection="column" paddingY={space['0.5']}>
            <FormControl.Label>
              {t('helpcenter.contact.subject.label')}
            </FormControl.Label>
            <Input onChangeText={setSubject} />
          </Row>
          <Row flexDirection="column" paddingY={space['0.5']}>
            <FormControl.Label>
              {t('helpcenter.contact.message.label')}
            </FormControl.Label>
            <TextArea
              onChangeText={setMessage}
              h={20}
              placeholder={'Deine Nachricht an die Teilnehmer:innen'}
              autoCompleteType={{}}
            />
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Row space={space['1']}>
            <Button variant="outline" onPress={onClose} isDisabled={isDisabled}>
              Abbrechen
            </Button>
            <Button
              onPress={() => onSend(subject, message)}
              isDisabled={isDisabled}>
              Senden
            </Button>
          </Row>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  )
}
export default SendParticipantsMessageModal
