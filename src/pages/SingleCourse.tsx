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
  VStack
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
import { useEffect, useMemo } from 'react'
import { useMatomo } from '@jonkoops/matomo-tracker-react'

type Props = {}

const SingleCourse: React.FC<Props> = () => {
  const { space, sizes } = useTheme()
  const { t } = useTranslation()
  const { trackPageView, trackEvent } = useMatomo()

  const location = useLocation()
  const { course: courseId } = (location.state || {}) as { course: LFSubCourse }
  const { userType } = useLernfair()

  const userQuery =
    userType === 'student'
      ? `participants{
    firstname
    grade
  }`
      : `otherParticipants{
    firstname
    grade
  }
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

  const { data: courseData, loading, error } = useQuery(query)

  const [joinSubcourse, _joinSubcourse] = useMutation(
    gql`
      mutation ($courseId: Float!) {
        subcourseJoin(subcourseId: $courseId)
      }
    `,
    {
      refetchQueries: [query]
    }
  )
  const [leaveSubcourse, _leaveSubcourse] = useMutation(
    gql`
      mutation ($courseId: Float!) {
        subcourseLeave(subcourseId: $courseId)
      }
    `,
    {
      refetchQueries: [query]
    }
  )
  const [joinWaitingList, _joinWaitingList] = useMutation(
    gql`
      mutation ($courseId: Float!) {
        subcourseJoinWaitinglist(subcourseId: $courseId)
      }
    `,
    {
      refetchQueries: [query]
    }
  )
  const [leaveWaitingList, _leaveWaitingList] = useMutation(
    gql`
      mutation ($courseId: Float!) {
        subcourseLeaveWaitinglist(subcourseId: $courseId)
      }
    `,
    {
      refetchQueries: [query]
    }
  )

  const course = courseData?.subcourse

  const participants = useMemo(
    () =>
      userType === 'student' ? course?.participants : course?.otherParticipants,
    [course?.otherParticipants, course?.participants, userType]
  )

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
  }, [])

  if (loading) return <></>

  return (
    <WithNavigation
      headerTitle={
        course?.course?.name.length > 20
          ? course?.course?.name.substring(0, 20)
          : course?.course?.name
      }
      headerLeft={<BackButton />}>
      <Box paddingX={space['1.5']} width={ContainerWidth}>
        <Box height="178px" marginBottom={space['1.5']}>
          <Image
            alt={course?.course?.name}
            borderRadius="8px"
            position="absolute"
            w="100%"
            height="100%"
            bgColor="gray.300"
            source={{
              uri: course?.course?.image || ''
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
          <Heading fontSize="md">Kursleiter Name</Heading>
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
                  <Row flexDirection="row" paddingBottom={space['1.5']}>
                    <Text bold marginRight={space['0.5']}>
                      {t('single.global.tutor')}:
                    </Text>
                    <Text>Max Mustermann</Text>
                  </Row>
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
                            'dd.MM.yyyy HH:mm'
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
            {
              title: t('single.tabs.participant'),
              content: (
                <>
                  {(participants?.length > 0 &&
                    participants.map((p: any) => (
                      <Row marginBottom={space['1.5']} alignItems="center">
                        <Column marginRight={space['1']}>
                          {/* <ProfilAvatar
                            size="md"
                            image="https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                          /> */}
                        </Column>
                        <Column>
                          <Heading fontSize="md">{p.firstname}</Heading>
                          <Text>{p.grade}</Text>
                        </Column>
                      </Row>
                    ))) || <Text>{t('single.global.noMembers')}</Text>}
                </>
              )
            }
          ]}
        />

        {userType === 'pupil' && (
          <Box marginBottom={space['0.5']} paddingLeft={space['1']}>
            {!course?.canJoin?.allowed && !course?.isParticipant && (
              <Text>{course?.canJoin?.reason}</Text>
            )}
            {!course?.isParticipant &&
              !course?.isOnWaitingList(
                <Button
                  onPress={() => {
                    joinSubcourse({ variables: { courseId: courseId } })
                  }}
                  width={ButtonContainer}
                  marginBottom={space['0.5']}
                  isDisabled={!course?.canJoin?.allowed || loading}>
                  {t('single.button.login')}
                </Button>
              )}
            {!course?.isParticipant && isFull && (
              <Button
                onPress={() => {
                  //subcourseJoinWaitinglist
                  // joinSubcourse({ variables: { courseId: courseId } })
                }}
                width={ButtonContainer}
                marginBottom={space['0.5']}
                isDisabled={!course?.canJoin?.allowed || loading}>
                {t('single.button.AddToWaitingList')}
              </Button>
            )}
            {course?.isOnWaitingList && (
              <VStack space={space['0.5']}>
                <Text>{t('single.buttoninfo.waitingListMember')}</Text>
                <Button
                  onPress={() => {
                    // subcourseLeaveWaitinglist(subcourseId: 11)
                    // leaveSubcourse({ variables: { courseId: courseId } })
                  }}
                  width={ButtonContainer}
                  marginBottom={space['0.5']}
                  isDisabled={loading}>
                  {t('single.button.leaveWaitingList')}
                </Button>
              </VStack>
            )}
            {course?.isParticipant && (
              <VStack space={space['0.5']}>
                <Text>{t('single.buttoninfo.successMember')}</Text>
                <Button
                  onPress={() => {
                    leaveSubcourse({ variables: { courseId: courseId } })
                  }}
                  width={ButtonContainer}
                  marginBottom={space['0.5']}
                  isDisabled={loading}>
                  {t('single.button.leaveCourse')}
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
