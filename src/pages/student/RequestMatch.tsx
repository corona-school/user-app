import { gql, useQuery } from '@apollo/client'
import { t } from 'i18next'
import { VStack, Modal, Button, useTheme } from 'native-base'
import { useCallback, useState, useTransition } from 'react'
import { useTranslation } from 'react-i18next'
import NotificationAlert from '../../components/NotificationAlert'
import ToggleButton from '../../components/ToggleButton'
import WithNavigation from '../../components/WithNavigation'

import RequestMatchPreview from './RequestMatchPreview'
import RequestMatchWizard from './RequestMatchWizard'

type Props = {}

const RequestMatch: React.FC<Props> = () => {
  const { space } = useTheme()
  const { t } = useTranslation()
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

  const { data, loading, error } = useQuery(gql`
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
            pupil {
              firstname
              subjects
              schooltype
              gradeAsInt
            }
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

  const requestMatch = useCallback(() => {}, [])

  return (
    <>
      <WithNavigation headerTitle={t('')} headerLeft={<NotificationAlert />}>
        <VStack paddingX={space['1']}>
          {currentIndex === 0 && (
            <RequestMatchWizard
              data={data}
              description={description}
              setDescription={setDescription}
              selectedClasses={selectedClasses}
              // setSelectedClasses={setSelectedClasses}
              selectedSubjects={selectedClasses}
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
            />
          )}
        </VStack>
      </WithNavigation>
      {console.log(selectedClasses, focusedSubject)}
      <Modal isOpen={showModal}>
        <Modal.Content>
          <Modal.Header>
            Für welche Klassen bietest du deine Unterstützung an?
          </Modal.Header>
          <Modal.Body>
            <VStack>
              <ToggleButton
                label="1. - 4. Klasse"
                dataKey="1"
                isActive={
                  selectedClasses[focusedSubject] &&
                  focusedSubject &&
                  selectedClasses[focusedSubject.name]['1']
                }
                // onPress={() =>
                //   setSelectedClasses(prev => ({
                //     [focusedSubject.name]: {
                //       1: !prev[focusedSubject.name]['1']
                //     }
                //   }))
                // }
              />
            </VStack>
          </Modal.Body>
          <Modal.Footer>
            <Button onPress={() => setShowModal(false)}>Speichern</Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  )
}
export default RequestMatch
