import { gql, useMutation, useQuery } from '@apollo/client'
import { VStack, Modal, Button, useTheme, Heading } from 'native-base'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import NotificationAlert from '../../components/NotificationAlert'
import ToggleButton from '../../components/ToggleButton'
import WithNavigation from '../../components/WithNavigation'
import useModal from '../../hooks/useModal'
import Utility from '../../Utility'
import MatchingBlocker from './MatchingBlocker'

import RequestMatchPreview from './RequestMatchPreview'
import RequestMatchWizard from './RequestMatchWizard'

type Props = {}

const RequestMatch: React.FC<Props> = () => {
  const { space } = useTheme()
  const { t } = useTranslation()
  const { setShow, setContent } = useModal()
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [selectedSubjects, setSelectedSubjects] = useState<{
    [key: string]: boolean
  }>({})
  const [selectedClasses, setSelectedClasses] = useState<{
    [key: string]: { [key: string]: boolean }
  }>({})

  const [focusedSubject, setFocusedSubject] = useState<any>({ name: '' })
  const [showModal, setShowModal] = useState<boolean>(false)
  const [description, setDescription] = useState<string>('')

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
      setContent(
        <>
          <Heading>Deine Anfrage wurde erstellt!</Heading>
          <Button
            onPress={() => {
              setShow(false)
            }}>
            Weiter
          </Button>
        </>
      )
      setShow(true)
    }
  }, [matchRequest?.data?.studentCreateMatchRequest, setContent, setShow])

  return (
    <>
      <WithNavigation headerTitle={t('')} headerLeft={<NotificationAlert />}>
        {(!data?.me?.student?.canRequestMatch?.allowed && (
          <VStack paddingX={space['1']}>
            {currentIndex === 0 && (
              <RequestMatchWizard
                data={data}
                description={description}
                setDescription={setDescription}
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
                description={description}
                subjects={Object.entries(selectedSubjects)
                  .filter(s => s[1])
                  .map(([key, val]) => key)}
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
          <Modal.Header>
            Für welche Klassen bietest du deine Unterstützung an?
          </Modal.Header>
          <Modal.Body>
            <VStack>
              {[
                `1. - 4. Klasse`,
                `5. - 8. Klasse`,
                `9. - 10. Klasse`,
                `11. - 13. Klasse`
              ].map((c, index) => {
                const i = index + 1
                const isSelected =
                  focusedSubject &&
                  !!selectedClasses[focusedSubject.name] &&
                  !!selectedClasses[focusedSubject.name][i]

                return (
                  <ToggleButton
                    label={c}
                    dataKey={`${i}`}
                    isActive={isSelected}
                    onPress={key => {
                      setSelectedClasses(prev => ({
                        ...prev,
                        [focusedSubject.name]: {
                          ...selectedClasses[focusedSubject.name],
                          [key]: !isSelected
                        }
                      }))
                    }}
                  />
                )
              })}
            </VStack>
          </Modal.Body>
          <Modal.Footer>
            <Button
              onPress={() => {
                const selectionCount = Object.values(
                  selectedClasses[focusedSubject.name] || {}
                ).filter(c => c).length
                if (selectionCount === 0) {
                  setSelectedSubjects(prev => {
                    const p = { ...prev }
                    p[focusedSubject.name] = false
                    return p
                  })
                }

                setShowModal(false)
              }}>
              Speichern
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  )
}
export default RequestMatch
