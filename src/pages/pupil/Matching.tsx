import { Text, VStack, Box, Button, Heading, Modal } from 'native-base'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import WithNavigation from '../../components/WithNavigation'
import CTACard from '../../widgets/CTACard'
import MatchingOnboarding from './MatchingOnboarding'
import MatchingWizard from './MatchingWizard'

type Props = {}

const Matching: React.FC<Props> = () => {
  const [showModal, setShowModal] = useState<boolean>(false)
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const { t } = useTranslation()

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
            {t('matching.modal.header')} <Modal.CloseButton />
          </Modal.Header>

          <Modal.Body>
            <VStack>
              <Text>{t('matching.modal.content')}</Text>
              <Text bold>{t('matching.modal.important')}</Text>
              <Text>
                {t('matching.modal.firstContent')}{' '}
                <Text bold> {t('matching.modal.middleContentBold')}</Text>{' '}
                {t('matching.modal.lastContent')}
              </Text>

              <Button
                onPress={() => {
                  setCurrentIndex(1)
                  setShowModal(false)
                }}>
                {t('matching.modal.buttons.continue')}
              </Button>
              <Button variant="outline">
                {t('matching.modal.buttons.showGroupCourse')}
              </Button>
            </VStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </>
  )
}
export default Matching
