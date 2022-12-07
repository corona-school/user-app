import { Text, Modal, VStack, Button, useTheme } from 'native-base'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import TextInput from '../components/TextInput'

type Props = {
  isOpen: boolean
  onClose?: () => void
  disableButtons?: boolean
  onPressStartMeeting?: (link: string) => void
}

const SetMeetingLinkModal: React.FC<Props> = ({
  isOpen,
  onClose,
  disableButtons,
  onPressStartMeeting
}) => {
  const [meetingLink, setMeetingLink] = useState<string>('')
  const { t } = useTranslation()
  const { space } = useTheme()

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>{t('course.meeting.modal.title')}</Modal.Header>
        <Modal.Body>
          <VStack space={space['0.5']}>
            <Text>{t('course.meeting.modal.text')}</Text>
            <TextInput
              placeholder="Video-URL"
              value={meetingLink}
              onChangeText={setMeetingLink}
            />
          </VStack>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onPress={() =>
              onPressStartMeeting && onPressStartMeeting(meetingLink)
            }
            isDisabled={meetingLink.length < 5 || disableButtons}>
            {t('course.meeting.modal.button')}
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  )
}
export default SetMeetingLinkModal
