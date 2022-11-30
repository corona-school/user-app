import {
  Box,
  Heading,
  useTheme,
  Text,
  Image,
  Column,
  Row,
  Button,
  useBreakpointValue,
  VStack,
  Modal
} from 'native-base'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import Tabs from '../components/Tabs'
import Tag from '../components/Tag'
import WithNavigation from '../components/WithNavigation'
import { LFLecture, LFSubCourse, LFTag } from '../types/lernfair/Course'
import CourseTrafficLamp from '../widgets/CourseTrafficLamp'

import Utility, { getTrafficStatus } from '../Utility'
import { gql, useMutation, useQuery } from '@apollo/client'
import { DateTime } from 'luxon'
import useLernfair from '../hooks/useLernfair'
import { useEffect, useMemo, useState } from 'react'
import { useMatomo } from '@jonkoops/matomo-tracker-react'
import { Participant as LFParticipant } from '../types/lernfair/User'
import AlertMessage from '../widgets/AlertMessage'

type Props = {}

const SingleCourse: React.FC<Props> = () => {
  const { space, sizes } = useTheme()
  const { t } = useTranslation()
  const { trackPageView, trackEvent } = useMatomo()

  const [loadParticipants, setLoadParticipants] = useState<boolean>()
  const [isSignedInModal, setSignedInModal] = useState(false)
  const [isSignedOutModal, setSignedOutModal] = useState(false)
  const [isOnWaitingListModal, setOnWaitingListModal] = useState(false)
  const [isLeaveWaitingListModal, setLeaveWaitingListModal] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()
  const { course: courseId } = (location.state || {}) as { course: LFSubCourse }
  const { userType } = useLernfair()

  const userQuery =
    userType === 'student'
      ? `
      isInstructor
      participants{
    firstname
    grade
  }`
      : `
  isOnWaitingList
  isParticipant 
  canJoin{
    allowed
    reason
    limit
  }`

  const query = gql`query{
    me {
      pupil{id}
      student{id}
    }
    subcourse(subcourseId: ${courseId}){
      id
      participantsCount
      maxParticipants
      instructors{
        firstname
        lastname
      }
      ${userQuery}
      course {
        name
        image
        outline
        category
        description
        subject
        tags{
          name
        }
        allowContact
      }
      lectures{
        start
        duration
      }
    }
  }`

  const participantQuery = gql`
  query{
    subcourse(subcourseId: ${courseId}){
      otherParticipants{
        firstname
        grade
      }
    }
  }`

  const { data: courseData, loading, error } = useQuery(query)

  const { data: participantData } = useQuery(participantQuery, {
    skip: !loadParticipants
  })

  const [joinSubcourse, _joinSubcourse] = useMutation(
    gql`
      mutation ($courseId: Float!) {
        subcourseJoin(subcourseId: $courseId)
      }
    `,
    {
      refetchQueries: [query, participantQuery]
    }
  )

  const [leaveSubcourse, _leaveSubcourse] = useMutation(
    gql`
      mutation ($courseId: Float!) {
        subcourseLeave(subcourseId: $courseId)
      }
    `,
    {
      refetchQueries: [query, participantQuery]
    }
  )
  const [joinWaitingList, _joinWaitingList] = useMutation(
    gql`
      mutation ($courseId: Float!) {
        subcourseJoinWaitinglist(subcourseId: $courseId)
      }
    `,
    {
      refetchQueries: [query, participantQuery]
    }
  )
  const [leaveWaitingList, _leaveWaitingList] = useMutation(
    gql`
      mutation ($courseId: Float!) {
        subcourseLeaveWaitinglist(subcourseId: $courseId)
      }
    `,
    {
      refetchQueries: [query, participantQuery]
    }
  )

  useEffect(() => {
    if (_joinSubcourse?.data?.subcourseJoin) {
      setSignedInModal(true)
    }
  }, [_joinSubcourse?.data?.subcourseJoin])

  useEffect(() => {
    if (_leaveSubcourse?.data?.subcourseLeave) {
      setSignedOutModal(true)
    }
  }, [_leaveSubcourse?.data?.subcourseLeave])

  useEffect(() => {
    if (_joinWaitingList?.data?.subcourseJoinWaitinglist) {
      setOnWaitingListModal(true)
    }
  }, [_joinWaitingList?.data?.subcourseJoinWaitinglist])

  useEffect(() => {
    if (_leaveWaitingList?.data?.subcourseLeaveWaitinglist) {
      setLeaveWaitingListModal(true)
    }
  }, [_leaveWaitingList?.data?.subcourseLeaveWaitinglist])

  const course = useMemo(() => courseData?.subcourse, [courseData])

  const participants = useMemo(() => {
    if (userType === 'student') {
      return course?.participants
    } else {
      if (course?.isParticipant) {
        return participantData?.subcourse?.otherParticipants
      }
    }
  }, [
    userType,
    course?.participants,
    course?.isParticipant,
    participantData?.subcourse?.otherParticipants
  ])

  const isFull = useMemo(
    () => course?.participantsCount >= course?.maxParticipants,
    [course?.maxParticipants, course?.participantsCount]
  )

  const ContainerWidth = useBreakpointValue({
    base: '100%',
    lg: sizes['containerWidth']
  })

  const ButtonContainer = useBreakpointValue({
    base: '100%',
    lg: sizes['desktopbuttonWidth']
  })

  const imageHeight = useBreakpointValue({
    base: '178px',
    lg: '260px'
  })

  useEffect(() => {
    trackPageView({
      documentTitle: course?.course?.name
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!loading && course) {
      course?.isParticipant && setLoadParticipants(true)
    }
  }, [course, loading])

  return (
    <>
      <WithNavigation
        headerTitle={
          course?.course?.name.length > 20
            ? course?.course?.name.substring(0, 20)
            : course?.course?.name
        }
        showBack
        isLoading={loading}>
        <Box
          paddingX={space['1.5']}
          maxWidth={ContainerWidth}
          marginX="auto"
          width="100%">
          <Box height={imageHeight} marginBottom={space['1.5']}>
            <Image
              alt={course?.course?.name}
              borderRadius="8px"
              position="absolute"
              w="100%"
              height="100%"
              bgColor="gray.300"
              source={{
                uri: course?.course?.image
              }}
            />
          </Box>
          <Box paddingBottom={space['0.5']}>
            <Row>
              {course?.course?.tags?.map((tag: LFTag) => (
                <Column marginRight={space['0.5']}>
                  <Tag text={tag.name} />
                </Column>
              ))}
            </Row>
          </Box>
          {course?.lectures.length > 0 && (
            <Text paddingBottom={space['0.5']}>
              {t('single.global.clockFrom')}{' '}
              {Utility.formatDate(course?.lectures[0].start)}{' '}
              {t('single.global.clock')}
            </Text>
          )}
          <Heading paddingBottom={space['1']}>{course?.course?.name}</Heading>
          <Row alignItems="center" paddingBottom={space['1']}>
            {/* <ProfilAvatar
            size="sm"
            marginRight={space['0.5']} 
            image="https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
          /> */}
            {course?.instructors && course?.instructors[0] && (
              <Heading fontSize="md">
                {course?.instructors[0].firstname}{' '}
                {course?.instructors[0].lastname}
              </Heading>
            )}
          </Row>
          <Text paddingBottom={space['1']}>{course?.course?.outline}</Text>

          <Box marginBottom={space['1']}>
            <CourseTrafficLamp
              status={getTrafficStatus(
                course?.participantsCount,
                course?.maxParticipants
              )}
            />
          </Box>

          {userType === 'pupil' && (
            <Box marginBottom={space['0.5']}>
              {!course?.canJoin?.allowed && !course?.isParticipant && (
                <AlertMessage
                  content={t(
                    `lernfair.reason.${course?.canJoin?.reason}.coursetext`
                  )}
                />
              )}
              {!course?.isParticipant && !course?.isOnWaitingList && (
                <Button
                  onPress={() => {
                    joinSubcourse({ variables: { courseId: courseId } })
                  }}
                  width={ButtonContainer}
                  marginBottom={space['0.5']}
                  isDisabled={
                    !course?.canJoin?.allowed || _joinSubcourse.loading
                  }>
                  {t('single.button.login')}
                </Button>
              )}
              {!course?.isParticipant && isFull && (
                <Button
                  onPress={() => {
                    joinWaitingList({
                      variables: { courseId: courseId }
                    })
                  }}
                  width={ButtonContainer}
                  marginBottom={space['0.5']}
                  isDisabled={!course?.canJoin?.allowed || loading}>
                  Auf die Warteliste
                </Button>
              )}
              {course?.isOnWaitingList && (
                <VStack space={space['0.5']}>
                  <AlertMessage
                    content={t('single.buttoninfo.waitingListMember')}
                  />
                  <Button
                    onPress={() => {
                      leaveWaitingList({ variables: { courseId: courseId } })
                    }}
                    width={ButtonContainer}
                    marginBottom={space['0.5']}
                    isDisabled={loading}>
                    Warteliste verlassen
                  </Button>
                </VStack>
              )}
              {course?.isParticipant && (
                <VStack space={space['0.5']}>
                  <AlertMessage
                    content={t('single.buttoninfo.successMember')}
                  />

                  <Button
                    onPress={() => {
                      leaveSubcourse({ variables: { courseId: courseId } })
                    }}
                    width={ButtonContainer}
                    marginBottom={space['0.5']}
                    isDisabled={loading}>
                    Kurs verlassen
                  </Button>
                </VStack>
              )}
            </Box>
          )}

          {userType === 'student' && course?.isInstructor && (
            <Box marginBottom={space['1.5']}>
              <Button
                onPress={() => {
                  navigate('/edit-course', {
                    state: { courseId: courseData.subcourse.id }
                  })
                }}
                width={ButtonContainer}
                variant="outline">
                Kurs editieren
              </Button>
            </Box>
          )}

          {course?.course?.allowContact && (
            <Box marginBottom={space['1.5']}>
              <Button
                onPress={() => {
                  window.location.href =
                    'mailto:testing@lernfair.de?subject=Kontaktaufnahme'
                  trackEvent({
                    category: 'kurs',
                    action: 'click-event',
                    name: 'Kurs Kontakt | ' + course?.course?.name,
                    documentTitle: 'Kurs Kontakt  | ' + course?.course?.name
                  })
                }}
                width={ButtonContainer}
                variant="outline">
                {t('single.button.contact')}
              </Button>
            </Box>
          )}

          <Tabs
            tabs={[
              {
                title: t('single.tabs.description'),
                content: (
                  <>
                    <Text marginBottom={space['1']}>
                      {course?.course?.description}
                    </Text>
                  </>
                )
              },
              {
                title: t('single.tabs.lessons'),
                content: (
                  <>
                    {(course?.lectures?.length > 0 &&
                      course.lectures.map((lec: LFLecture, i: number) => (
                        <Row flexDirection="column" marginBottom={space['1.5']}>
                          <Heading paddingBottom={space['0.5']} fontSize="md">
                            {t('single.global.lesson')}{' '}
                            {`${i + 1}`.padStart(2, '0')}
                          </Heading>
                          <Text paddingBottom={space['0.5']}>
                            {DateTime.fromISO(lec.start).toFormat('dd.MM.yyyy')}
                            <Text marginX="3px">•</Text>
                            {DateTime.fromISO(lec.start).toFormat('HH:mm')}{' '}
                            {t('single.global.clock')}
                          </Text>
                          <Text>
                            <Text bold>{t('single.global.duration')}: </Text>{' '}
                            {(typeof lec?.duration !== 'number'
                              ? parseInt(lec?.duration)
                              : lec?.duration) / 60}{' '}
                            {t('single.global.hours')}
                          </Text>
                        </Row>
                      ))) || <Text>{t('single.global.noLections')}</Text>}
                  </>
                )
              },
              course?.isParticipant && {
                title: t('single.tabs.participant'),
                content: (
                  <>
                    {(participants?.length > 0 &&
                      participants.map((p: LFParticipant) => (
                        <Participant pupil={p} />
                      ))) || <Text>{t('single.global.noMembers')}</Text>}
                  </>
                )
              }
            ]}
          />
        </Box>
      </WithNavigation>
      {/* loggin  */}
      <Modal isOpen={isSignedInModal} onClose={() => setSignedInModal(false)}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Kurseinformationen</Modal.Header>
          <Modal.Body>
            <Text marginBottom={space['1']}>
              Du hast dich nun erfolgreich zum Kurs angemeldet.
            </Text>
            <Row justifyContent="center">
              <Column>
                <Button
                  onPress={() => {
                    setSignedInModal(false)
                  }}>
                  Fenster schließen
                </Button>
              </Column>
            </Row>
          </Modal.Body>
        </Modal.Content>
      </Modal>
      {/* loggout  */}
      <Modal isOpen={isSignedOutModal} onClose={() => setSignedOutModal(false)}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Kurseinformationen</Modal.Header>
          <Modal.Body>
            <Text marginBottom={space['1']}>
              Du hast dich nun erfolgreich zum Kurs abgemeldet.
            </Text>
            <Row justifyContent="center">
              <Column>
                <Button
                  onPress={() => {
                    setSignedOutModal(false)
                  }}>
                  Fenster schließen
                </Button>
              </Column>
            </Row>
          </Modal.Body>
        </Modal.Content>
      </Modal>
      {/* waitinglist */}
      <Modal
        isOpen={isOnWaitingListModal}
        onClose={() => setOnWaitingListModal(false)}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Kurseinformationen</Modal.Header>
          <Modal.Body>
            <Text marginBottom={space['1']}>
              Du hast dich nun erfolgreich zum Kurs abgemeldet.
            </Text>
            <Row justifyContent="center">
              <Column>
                <Button
                  onPress={() => {
                    setOnWaitingListModal(false)
                  }}>
                  Fenster schließen
                </Button>
              </Column>
            </Row>
          </Modal.Body>
        </Modal.Content>
      </Modal>
      {/* waitinglist */}
      <Modal
        isOpen={isOnWaitingListModal}
        onClose={() => setOnWaitingListModal(false)}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Kurseinformationen</Modal.Header>
          <Modal.Body>
            <Text marginBottom={space['1']}>
              Du hast dich erfolgreich auf die Warteliste angemeldet.
            </Text>
            <Row justifyContent="center">
              <Column>
                <Button
                  onPress={() => {
                    setOnWaitingListModal(false)
                  }}>
                  Fenster schließen
                </Button>
              </Column>
            </Row>
          </Modal.Body>
        </Modal.Content>
      </Modal>
      {/* leave waitinglist */}
      <Modal
        isOpen={isLeaveWaitingListModal}
        onClose={() => setLeaveWaitingListModal(false)}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Kurseinformationen</Modal.Header>
          <Modal.Body>
            <Text marginBottom={space['1']}>
              Du hast die Warteliste erfolgreich verlassen.
            </Text>
            <Row justifyContent="center">
              <Column>
                <Button
                  onPress={() => {
                    setLeaveWaitingListModal(false)
                  }}>
                  Fenster schließen
                </Button>
              </Column>
            </Row>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </>
  )
}
export default SingleCourse

type ParticipantProps = {
  pupil: LFParticipant
}
const Participant: React.FC<ParticipantProps> = ({ pupil }) => {
  const { space } = useTheme()
  return (
    <Row marginBottom={space['1.5']} alignItems="center">
      <Column marginRight={space['1']}>
        {/* <ProfilAvatar
      size="md"
      image="https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
    /> */}
      </Column>
      <Column>
        <Heading fontSize="md">{pupil.firstname}</Heading>
        <Text>{pupil.grade}</Text>
      </Column>
    </Row>
  )
}
