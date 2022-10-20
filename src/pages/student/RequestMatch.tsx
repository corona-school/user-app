import { gql, useMutation, useQuery } from '@apollo/client'
import {
  VStack,
  Modal,
  Button,
  useTheme,
  useBreakpointValue
} from 'native-base'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import NotificationAlert from '../../components/NotificationAlert'
import ToggleButton from '../../components/ToggleButton'
import WithNavigation from '../../components/WithNavigation'
import Utility from '../../Utility'
import MatchingBlocker from './MatchingBlocker'

import RequestMatchPreview from './RequestMatchPreview'
import RequestMatchWizard from './RequestMatchWizard'

type Props = {}

const RequestMatch: React.FC<Props> = () => {
  const { space, sizes } = useTheme()
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
    // console.log('request match', {
    //   selectedSubjects,
    //   selectedClasses,
    //   focusedSubject,
    //   description
    // })
    createMatchRequest()
  }, [createMatchRequest])

  useEffect(() => {
    if (matchRequest?.data?.studentCreateMatchRequest) {
      // TODO show success
    }
  }, [matchRequest])

  return (
    <>
      <WithNavigation headerTitle={t('')} headerLeft={<NotificationAlert />}>
        {(data?.me?.student?.canRequestMatch?.allowed && (
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
                disableButton={!data?.me?.student?.canRequestMatch?.allowed}
                disableReason={data?.me?.student?.canRequestMatch?.reason}
              />
            )}
          </VStack>
        )) || <MatchingBlocker />}
      </WithNavigation>
      {console.log(selectedClasses, focusedSubject)}
      <Modal isOpen={showModal}>
        <Modal.Content>
          <Modal.Header>{t('matching.request.modal.header')}</Modal.Header>
          <Modal.Body>
            <VStack>
              {focusedSubject?.grade?.min < 5 &&
                focusedSubject?.grade?.max >= 4 && (
                  <ToggleButton
                    label={`1. - 4. Klasse`}
                    dataKey={'1'}
                    isActive={
                      focusedSubject &&
                      selectedClasses[focusedSubject.name] &&
                      selectedClasses[focusedSubject.name][1]
                    }
                    onPress={() =>
                      setSelectedClasses(prev => ({
                        ...prev,
                        [focusedSubject.name]: {
                          1:
                            prev[focusedSubject.name] &&
                            (!prev[focusedSubject.name][1] || false)
                        }
                      }))
                    }
                  />
                )}
              {focusedSubject?.grade?.min <= 5 &&
                focusedSubject?.grade?.max >= 8 && (
                  <ToggleButton
                    label={`5. - 8. Klasse`}
                    dataKey={'2'}
                    isActive={
                      focusedSubject &&
                      selectedClasses[focusedSubject.name] &&
                      selectedClasses[focusedSubject.name][2]
                    }
                    onPress={() =>
                      setSelectedClasses(prev => ({
                        ...prev,
                        [focusedSubject.name]: {
                          2:
                            prev[focusedSubject.name] &&
                            (!prev[focusedSubject.name][2] || false)
                        }
                      }))
                    }
                  />
                )}
              {focusedSubject?.grade?.min <= 9 &&
                focusedSubject?.grade?.max >= 10 && (
                  <ToggleButton
                    label={`9. - 10. Klasse`}
                    dataKey={'3'}
                    isActive={
                      focusedSubject &&
                      selectedClasses[focusedSubject.name] &&
                      selectedClasses[focusedSubject.name][3]
                    }
                    onPress={() =>
                      setSelectedClasses(prev => ({
                        ...prev,
                        [focusedSubject.name]: {
                          3:
                            prev[focusedSubject.name] &&
                            (!prev[focusedSubject.name][3] || false)
                        }
                      }))
                    }
                  />
                )}
              {focusedSubject?.grade?.min <= 11 && (
                <ToggleButton
                  label={`11. - 13. Klasse`}
                  dataKey={'4'}
                  isActive={
                    focusedSubject &&
                    selectedClasses[focusedSubject.name] &&
                    selectedClasses[focusedSubject.name][4]
                  }
                  onPress={() =>
                    setSelectedClasses(prev => ({
                      ...prev,
                      [focusedSubject.name]: {
                        4:
                          prev[focusedSubject.name] &&
                          (!prev[focusedSubject.name][4] || false)
                      }
                    }))
                  }
                />
              )}
            </VStack>
          </Modal.Body>
          <Modal.Footer>
            <Button onPress={() => setShowModal(false)}>
              {t('matching.request.modal.save')}
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  )
}
export default RequestMatch
