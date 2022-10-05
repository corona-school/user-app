import { Text, VStack, Heading, Button, Modal, Radio } from 'native-base'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CTACard from '../../widgets/CTACard'

type Props = {}

const MatchingPending: React.FC<Props> = () => {
  const [showModal, setShowModal] = useState<boolean>(false)
  const [feedback, setFeedback] = useState<string>()
  const { t } = useTranslation()

  const cancelMatchRequest = useCallback((sendFeedback: boolean) => {
    setShowModal(false)
    // TODO cancel
  }, [])

  return (
    <>
      <VStack>
        <Heading>{t('matching.pending.header')}</Heading>
        <Text>
          <Text bold>{t('matching.pending.requestFrom')}</Text> 25.07.2022
        </Text>
        <Text>
          <Text bold>{t('matching.pending.waitingTime')}</Text>{' '}
          {t('matching.pending.waitingTimeMonthCa')} 1{' '}
          {t('matching.pending.waitingTimeMonth')}
        </Text>
        <Text>{t('matching.pending.content')}</Text>
        <Button variant="outline" onPress={() => setShowModal(true)}>
          {t('matching.pending.buttons.cancel')}
        </Button>

        <CTACard
          title={t('matching.pending.cta.title')}
          content={<Text>{t('matching.pending.cta.content')}</Text>}
          button={<Button>{t('matching.pending.buttons.cta')}</Button>}
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
            <Button
              variant={'outline'}
              isDisabled={!feedback}
              onPress={() => cancelMatchRequest(false)}>
              {t('matching.pending.modal.buttons.shareFeedback')}
            </Button>
            <Button
              variant={'outline'}
              onPress={() => cancelMatchRequest(false)}>
              {t('matching.pending.modal.buttons.nothing')}
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  )
}
export default MatchingPending
