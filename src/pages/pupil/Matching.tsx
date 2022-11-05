import { DocumentNode, gql, useQuery } from '@apollo/client'
import { useMatomo } from '@jonkoops/matomo-tracker-react'
import { Text, VStack, Button, Modal, useTheme, Heading } from 'native-base'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import AsNavigationItem from '../../components/AsNavigationItem'
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner'
import WithNavigation from '../../components/WithNavigation'
import Hello from '../../widgets/Hello'
import MatchingOnboarding from './MatchingOnboarding'
import MatchingPending from './MatchingPending'
import MatchingWizard from './MatchingWizard'

type Props = {}

const query: DocumentNode = gql`
  query {
    me {
      pupil {
        openMatchRequestCount
      }
    }
  }
`

const Matching: React.FC<Props> = () => {
  const { space } = useTheme()
  const [showModal, setShowModal] = useState<boolean>(false)
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { trackPageView, trackEvent } = useMatomo()

  const { data, loading } = useQuery(query)

  useEffect(() => {
    trackPageView({
      documentTitle: 'Schüler Matching'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) return <CenterLoadingSpinner />

  return (
    <>
      <AsNavigationItem path="matching">
        <WithNavigation headerContent={<Hello />}>
          {(data?.me?.pupil.openMatchRequestCount === 0 && (
            <>
              {currentIndex === 0 && (
                <MatchingOnboarding onRequestMatch={() => setShowModal(true)} />
              )}
              {currentIndex === 1 && <MatchingWizard />}
            </>
          )) || <MatchingPending refetchQuery={query} />}
        </WithNavigation>
      </AsNavigationItem>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>{t('matching.modal.header')}</Modal.Header>

          <Modal.Body>
            <VStack space={space['1']}>
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
                  trackEvent({
                    category: 'matching',
                    action: 'click-event',
                    name: 'Schüler Matching – Klick auf weiter im Fenster',
                    documentTitle: 'Schüler Matching'
                  })
                }}>
                {t('matching.modal.buttons.continue')}
              </Button>

              <Button variant="outline" onPress={() => navigate('/group')}>
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
