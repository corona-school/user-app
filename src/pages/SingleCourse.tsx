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
  Alert,
  HStack
} from 'native-base'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import BackButton from '../components/BackButton'
import Tabs from '../components/Tabs'
import Tag from '../components/Tag'
import WithNavigation from '../components/WithNavigation'
import { LFLecture, LFSubCourse, LFTag } from '../types/lernfair/Course'
import CourseTrafficLamp from '../widgets/CourseTrafficLamp'
import ProfilAvatar from '../widgets/ProfilAvatar'

import Utility from '../Utility'
import { gql, useMutation, useQuery } from '@apollo/client'
import { DateTime } from 'luxon'
import useLernfair from '../hooks/useLernfair'
import { useEffect, useMemo, useState } from 'react'
import { useMatomo } from '@jonkoops/matomo-tracker-react'
import { Participant as LFParticipant } from '../types/lernfair/User'

type Props = {}

const SingleCourse: React.FC<Props> = () => {
  const { space, sizes } = useTheme()
  const { t } = useTranslation()
  const { trackPageView, trackEvent } = useMatomo()

  const [loadParticipants, setLoadParticipants] = useState<boolean>()
  const location = useLocation()
  const { course: courseId } = (location.state || {}) as { course: LFSubCourse }
  const { userType } = useLernfair()

  const userQuery =
    userType === 'student'
      ? `participants{
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
      course {
        name
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

  if (loading) return <></>

  return (
    <WithNavigation
      headerTitle={
        course?.course?.name.length > 20
          ? course?.course?.name.substring(0, 20)
          : course?.course?.name
      }
      showBack>
      <Box paddingX={space['1.5']} maxWidth={ContainerWidth}>
        <Box height="178px" marginBottom={space['1.5']}>
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
        <Text paddingBottom={space['0.5']}>
          {t('single.global.clockFrom')}{' '}
          {Utility.formatDate(course?.lectures[0].start)}{' '}
          {t('single.global.clock')}
        </Text>
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

        <Box>
          <CourseTrafficLamp
            status={
              course?.participantsCount === course?.maxParticipants
                ? 'full'
                : course?.maxParticipants - course?.participantsCount < 5
                ? 'last'
                : 'free'
            }
          />
        </Box>

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
              title: t('single.tabs.help'),
              content: (
                <>
                  <Row flexDirection="row" paddingBottom={space['0.5']}>
                    <Text bold marginRight={space['0.5']}>
                      {t('single.global.participating')}:
                    </Text>
                    <Text>
                      {course?.participantsCount}/{course?.maxParticipants}
                    </Text>
                  </Row>
                  <Row flexDirection="row" paddingBottom={space['0.5']}>
                    <Text bold marginRight={space['0.5']}>
                      {t('single.global.quantity')}:
                    </Text>
                    <Text>
                      {course?.lectures?.length} {t('single.global.lessons')}:
                    </Text>
                  </Row>
                  <Row flexDirection="row" paddingBottom={space['0.5']}>
                    <Text bold marginRight={space['0.5']}>
                      {t('single.global.duration')}:
                    </Text>
                    <Text>
                      {course?.lectures &&
                        `${course?.lectures[0]?.duration / 60} Stunde(n)`}
                    </Text>
                  </Row>
                  {course?.instructors && (
                    <VStack>
                      {course?.instructors[0] && (
                        <Row flexDirection="row" paddingBottom={space['1.5']}>
                          <Text bold marginRight={space['0.5']}>
                            {t('single.global.tutor')}:
                          </Text>

                          <Text>
                            {course?.instructors[0].firstname}{' '}
                            {course?.instructors[0].lastname}
                          </Text>
                        </Row>
                      )}
                      {course?.instructors.length > 1 && (
                        <VStack>
                          <Text bold marginRight={space['0.5']}>
                            {t('single.global.more_tutors')}:
                          </Text>
                          {course?.instructors
                            .slice(1)
                            .map(
                              (instructor: {
                                firstname: string
                                lastname: string
                              }) => (
                                <Text>
                                  {instructor.firstname} {instructor.lastname}
                                </Text>
                              )
                            )}
                        </VStack>
                      )}
                    </VStack>
                  )}
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
                          {DateTime.fromISO(lec.start).toFormat(
                            'dd.MM.yyyy hh:mm'
                          )}{' '}
                          {t('single.global.clock')}
                        </Text>
                        <Text>
                          <Text bold>{t('single.global.duration')}: </Text>{' '}
                          {lec?.duration / 60} {t('single.global.hours')}
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

        {userType === 'pupil' && (
          <Box marginBottom={space['0.5']} paddingLeft={space['1']}>
            {!course?.canJoin?.allowed && !course?.isParticipant && (
              <Alert
                alignItems="start"
                marginY={space['1']}
                maxW="350"
                colorScheme="info">
                <HStack space={2} flexShrink={1} alignItems="center">
                  <Alert.Icon />
                  {/* { 
                    !course?.isParticipant ?  
                      <Text>{course?.canJoin?.reason}</Text>
                    : !course?.isOnWaitingList ? 

                    :  ''
                  } */}
                  <Text>{course?.canJoin?.reason}</Text>
                </HStack>
              </Alert>
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
                <Alert
                  alignItems="start"
                  marginY={space['1']}
                  maxW="350"
                  colorScheme="info">
                  <HStack space={2} flexShrink={1} alignItems="center">
                    <Alert.Icon />
                    <Text>{t('single.buttoninfo.waitingListMember')}</Text>
                  </HStack>
                </Alert>
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
                <Alert
                  alignItems="start"
                  marginY={space['1']}
                  maxW="350"
                  colorScheme="info">
                  <HStack space={2} flexShrink={1} alignItems="center">
                    <Alert.Icon />
                    <Text>{t('single.buttoninfo.successMember')}</Text>
                  </HStack>
                </Alert>

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
        {course?.allowContact && (
          <Box marginBottom={space['1.5']} paddingLeft={space['1']}>
            <Button
              onPress={() => {
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
      </Box>
    </WithNavigation>
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
