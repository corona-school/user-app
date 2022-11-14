import { gql, useMutation, useQuery } from '@apollo/client'
import { useMatomo } from '@jonkoops/matomo-tracker-react'
import { VStack, Modal, Button, useTheme, Heading, Text } from 'native-base'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import NotificationAlert from '../../components/Notification/NotificationAlert'
import WithNavigation from '../../components/WithNavigation'
import useModal from '../../hooks/useModal'

import MatchingBlocker from './MatchingBlocker'

import RequestMatchPreview from './RequestMatchPreview'
import RequestMatchWizard from './RequestMatchWizard'
import { Slider } from '@miblanchard/react-native-slider'
import { ClassRange } from '../../types/lernfair/SchoolClass'
import { Navigate, useNavigate } from 'react-router-dom'

type Props = {}

const RequestMatch: React.FC<Props> = () => {
  const { space, colors } = useTheme()
  const { t } = useTranslation()
  const { setShow, setContent } = useModal()
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [selectedSubjects, setSelectedSubjects] = useState<{
    [key: string]: boolean
  }>({})
  const [selectedClasses, setSelectedClasses] = useState<{
    [key: string]: ClassRange
  }>({})

  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false)
  const [focusedSubject, setFocusedSubject] = useState<any>({ name: '' })
  const [showModal, setShowModal] = useState<boolean>(false)
  const navigate = useNavigate()

  const { data } = useQuery(gql`
    query {
      me {
        student {
          subjectsFormatted {
            name
            grade {
              min
              max
            }
          }
          matches {
            id
          }
          canRequestMatch {
            allowed
            reason
            limit
          }
          openMatchRequestCount
        }
      }
    }
  `)

  const [createMatchRequest, matchRequest] = useMutation(gql`
    mutation {
      studentCreateMatchRequest
    }
  `)

  const requestMatch = useCallback(() => {
    createMatchRequest()
  }, [createMatchRequest])

  useEffect(() => {
    if (matchRequest?.data?.studentCreateMatchRequest) {
      setShowSuccessModal(true)
    }
  }, [matchRequest?.data?.studentCreateMatchRequest, setContent, setShow])

  const { trackPageView } = useMatomo()

  useEffect(() => {
    trackPageView({
      documentTitle: 'Helfer Match anfragen'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <WithNavigation headerTitle={t('')} headerLeft={<NotificationAlert />}>
        {(data?.me?.student?.canRequestMatch?.allowed && (
          <VStack paddingX={space['1']}>
            {currentIndex === 0 && (
              <RequestMatchWizard
                data={data}
                selectedClasses={selectedClasses}
                // setSelectedClasses={setSelectedClasses}
                selectedSubjects={selectedSubjects}
                setSelectedSubjects={setSelectedSubjects}
                setCurrentIndex={setCurrentIndex}
                setFocusedSubject={setFocusedSubject}
                setShowModal={setShowModal}
              />
            )}
            {currentIndex === 1 && (
              <RequestMatchPreview
                subjects={Object.entries(selectedSubjects)
                  .filter(s => s[1])
                  .map(([key, val]) => ({
                    name: key
                  }))}
                classes={selectedClasses}
                onRequestMatch={requestMatch}
                onBack={() => setCurrentIndex(0)}
                disableButton={!data?.me?.student?.canRequestMatch?.allowed}
                disableReason={data?.me?.student?.canRequestMatch?.reason}
              />
            )}
          </VStack>
        )) || <MatchingBlocker />}
      </WithNavigation>

      <Modal isOpen={showModal}>
        <Modal.Content>
          <Modal.Header>{t('matching.request.modal.header')}</Modal.Header>
          <Modal.Body>
            <Heading fontSize="md">
              Klassen{' '}
              {(selectedClasses[focusedSubject.name] &&
                selectedClasses[focusedSubject.name].min) ||
                1}{' '}
              -{' '}
              {(selectedClasses[focusedSubject.name] &&
                selectedClasses[focusedSubject.name].max) ||
                13}
            </Heading>
            <Slider
              animateTransitions
              minimumValue={1}
              maximumValue={13}
              minimumTrackTintColor={colors['primary']['500']}
              thumbTintColor={colors['primary']['900']}
              value={
                (selectedClasses[focusedSubject.name] && [
                  selectedClasses[focusedSubject.name].min,
                  selectedClasses[focusedSubject.name].max
                ]) || [1, 13]
              }
              step={1}
              onValueChange={(value: number | number[]) => {
                Array.isArray(value) &&
                  setSelectedClasses(prev => ({
                    ...prev,
                    [focusedSubject.name]: { min: value[0], max: value[1] }
                  }))
              }}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button
              onPress={() => {
                setShowModal(false)
              }}>
              {t('matching.request.modal.save')}
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
      <Modal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false)
          navigate('/matching')
        }}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Anfrage erstellt</Modal.Header>
          <Modal.Body>
            <>
              <Text>Deine Anfrage wurde erfolgreich erstellt!</Text>
            </>
          </Modal.Body>
          <Modal.Footer>
            <Button
              onPress={() => {
                setShowSuccessModal(false)
                navigate('/matching')
              }}>
              {t('next')}
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  )
}
export default RequestMatch
