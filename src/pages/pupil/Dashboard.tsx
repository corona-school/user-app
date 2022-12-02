import {
  Text,
  Button,
  Heading,
  HStack,
  useTheme,
  VStack,
  useBreakpointValue,
  Flex,
  useToast,
  Alert,
  Column,
  Box
} from 'native-base'
import { useCallback, useEffect, useMemo, useState } from 'react'
import AppointmentCard from '../../widgets/AppointmentCard'
import HSection from '../../widgets/HSection'
import SignInCard from '../../widgets/SignInCard'
import TeacherCard from '../../widgets/TeacherCard'
import WithNavigation from '../../components/WithNavigation'
import { useNavigate } from 'react-router-dom'
import NotificationAlert from '../../components/NotificationAlert'
import { useTranslation } from 'react-i18next'
import { gql, useMutation, useQuery } from '@apollo/client'
import { LFLecture, LFSubCourse } from '../../types/lernfair/Course'

import { LFMatch } from '../../types/lernfair/Match'
import { DateTime } from 'luxon'
import { useMatomo } from '@jonkoops/matomo-tracker-react'
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner'

import AsNavigationItem from '../../components/AsNavigationItem'
import DissolveMatchModal from '../../modals/DissolveMatchModal'
import Hello from '../../widgets/Hello'
import AlertMessage from '../../widgets/AlertMessage'
import CancelMatchRequestModal from '../../modals/CancelMatchRequestModal'
import { getTrafficStatus } from '../../Utility'

type Props = {}

const query = gql`
  query {
    me {
      firstname
      pupil {
        matches {
          id
          dissolved
          subjectsFormatted {
            name
          }
          student {
            id
            firstname
            lastname
          }
        }
        firstMatchRequest
        openMatchRequestCount
        canRequestMatch {
          allowed
          reason
          limit
        }
        canJoinSubcourses {
          allowed
          reason
          limit
        }
        subcoursesJoined {
          id
          isParticipant
          lectures {
            start
          }
          course {
            name
            outline
            image
            tags {
              name
            }
          }
        }
      }
    }

    subcoursesPublic(take: 10, skip: 0, excludeKnown: true) {
      id
      minGrade
      maxGrade
      maxParticipants
      joinAfterStart
      maxParticipants
      participantsCount

      course {
        name
        description
        outline
        image
        tags {
          name
        }
      }
      lectures {
        start
        duration
      }
    }
  }
`

const Dashboard: React.FC<Props> = () => {
  const { data, loading, called } = useQuery(query)

  const { space, sizes } = useTheme()
  const toast = useToast()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { trackPageView, trackEvent } = useMatomo()
  const [showDissolveModal, setShowDissolveModal] = useState<boolean>(false)
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false)
  const [dissolveData, setDissolveData] = useState<LFMatch>()
  const [toastShown, setToastShown] = useState<boolean>()
  const [showMeetingNotStarted, setShowMeetingNotStarted] = useState<boolean>()
  const [showMeetingButton, setShowMeetingButton] = useState<boolean>(false)

  useEffect(() => {
    trackPageView({
      documentTitle: 'Schüler – Dashboard'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isMobile = useBreakpointValue({ base: true, lg: false })

  const ContainerWidth = useBreakpointValue({
    base: '100%',
    lg: sizes['containerWidth']
  })

  const CardGrid = useBreakpointValue({
    base: '100%',
    lg: '46%'
  })

  const ButtonContainer = useBreakpointValue({
    base: '100%',
    lg: sizes['desktopbuttonWidth']
  })

  const sortedAppointments: { course: LFSubCourse; lecture: LFLecture }[] =
    useMemo(() => {
      const lectures: { course: LFSubCourse; lecture: LFLecture }[] = []

      if (!data?.me?.pupil?.subcoursesJoined) return []

      for (const sub of data?.me?.pupil?.subcoursesJoined) {
        const futureLectures = sub.lectures.filter(
          (lecture: LFLecture) =>
            DateTime.now().toMillis() <
            DateTime.fromISO(lecture.start).toMillis()
        )

        for (const lecture of futureLectures) {
          lectures.push({ lecture: lecture, course: sub })
        }
      }

      return lectures.sort((a, b) => {
        const _a = DateTime.fromISO(a.lecture.start).toMillis()
        const _b = DateTime.fromISO(b.lecture.start).toMillis()

        if (_a > _b) return 1
        else if (_a < _b) return -1
        else return 0
      })
    }, [data?.me?.pupil?.subcoursesJoined])

  const highlightedAppointment:
    | { course: LFSubCourse; lecture: LFLecture }
    | undefined = useMemo(() => sortedAppointments[0], [sortedAppointments])

  const [cancelMatchRequest, _cancelMatchRequest] = useMutation(
    gql`
      mutation cancelMatchRequest {
        pupilDeleteMatchRequest
      }
    `,
    {
      refetchQueries: [query]
    }
  )

  const cancelMatchRequestReaction = useCallback(
    (shareFeedback: boolean, feedback?: string) => {
      trackEvent({
        category: 'Schüler',
        action: 'Match Request zurückgezogen',
        name: 'Schüler - Dashboard'
      })

      cancelMatchRequest()
      setShowCancelModal(false)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cancelMatchRequest]
  )

  const [dissolve, _dissolve] = useMutation(
    gql`
      mutation dissolve($matchId: Float!, $dissolveReason: Float!) {
        matchDissolve(dissolveReason: $dissolveReason, matchId: $matchId)
      }
    `,
    {
      refetchQueries: [query]
    }
  )

  // const [joinMeeting, _joinMeeting] = useMutation(gql`mutation{
  //   subcourseJoinMeeting(subcourseId: ${courseId})
  // }`)

  const dissolveMatch = useCallback((match: LFMatch) => {
    setDissolveData(match)
    setShowDissolveModal(true)
  }, [])

  useEffect(() => {
    if (_dissolve?.data?.matchDissolve && !toastShown) {
      setToastShown(true)
      toast.show({
        description: 'Das Match wurde aufgelöst'
      })
    }
  }, [_dissolve?.data?.matchDissolve, toast, toastShown])

  const activeMatches = useMemo(() => {
    return data?.me?.pupil?.matches?.filter(
      (match: LFMatch) => !match.dissolved
    )
  }, [data?.me?.pupil?.matches])

  // const getMeetingLink = useCallback(async () => {
  //   try {
  //     const res = await joinMeeting({ variables: { subcourseId: courseId } })

  //     if (res.data.subcourseJoinMeeting) {
  //       window.open(res.data.subcourseJoinMeeting, '_blank')
  //     } else {
  //       setShowMeetingNotStarted(true)
  //     }
  //   } catch (e) {
  //     setShowMeetingNotStarted(true)
  //   }
  // }, [courseId, joinMeeting])

  // useEffect(() => {
  //   if (!courseId || !course?.lectures) return
  //   const lec = getFirstLectureFromSubcourse(course?.lectures, false)
  //   if (DateTime.fromISO(lec.start).diffNow('minutes').minutes <= 15) {
  //     setShowMeetingButton(true)
  //   }
  // }, [course?.lectures, courseId, getMeetingLink])

  return (
    <AsNavigationItem path="start">
      <WithNavigation
        headerContent={
          !loading && (
            <HStack
              maxWidth={ContainerWidth}
              space={space['1']}
              alignItems="center"
              bgColor={isMobile ? 'primary.900' : 'transparent'}
              padding={isMobile ? space['1.5'] : space['0.5']}>
              <Hello />
            </HStack>
          )
        }
        headerLeft={<NotificationAlert />}>
        {!called || (loading && <CenterLoadingSpinner />)}
        {called && !loading && (
          <VStack
            paddingX={space['1']}
            marginX="auto"
            width="100%"
            maxWidth={ContainerWidth}>
            <VStack>
              {highlightedAppointment && (
                <VStack marginBottom={space['1.5']}>
                  <Heading marginBottom={space['1']}>
                    {t('dashboard.appointmentcard.header')}
                  </Heading>

                  <AppointmentCard
                    videoButton={
                      highlightedAppointment?.course?.isParticipant &&
                      showMeetingButton && (
                        <Button
                          width="100%"
                          marginTop={space['1']}
                          // onPress={getMeetingLink}
                          // isDisabled={_joinMeeting.loading}
                        >
                          Videochat beitreten
                        </Button>
                      )
                    }
                    isTeaser={true}
                    onPressToCourse={() => {
                      trackEvent({
                        category: 'dashboard',
                        action: 'click-event',
                        name:
                          'Schüler Dashboard – Termin Teaser | Klick auf' +
                          sortedAppointments[0]?.course.course?.name,
                        documentTitle: 'Schüler Dashboard'
                      })
                      navigate('/single-course', {
                        state: { course: sortedAppointments[0]?.course.id }
                      })
                    }}
                    tags={highlightedAppointment?.course?.course?.tags}
                    date={highlightedAppointment?.lecture.start}
                    image={highlightedAppointment?.course.course?.image}
                    title={highlightedAppointment?.course.course?.name}
                    description={highlightedAppointment?.course.course?.outline}
                  />
                </VStack>
              )}

              {/* Appointments */}
              <HSection
                marginBottom={space['1.5']}
                title={t('dashboard.myappointments.header')}>
                {(sortedAppointments.length > 1 &&
                  sortedAppointments
                    .slice(1, 5)
                    .map(
                      ({
                        course,
                        lecture
                      }: {
                        course: LFSubCourse
                        lecture: LFLecture
                      }) => {
                        if (!course) return <></>

                        return (
                          <Column
                            minWidth="230px"
                            maxWidth="300px"
                            flex={1}
                            h="100%">
                            <AppointmentCard
                              isGrid
                              isFullHeight
                              onPressToCourse={() => {
                                trackEvent({
                                  category: 'dashboard',
                                  action: 'click-event',
                                  name:
                                    'Schüler Dashboard – Meine Termin | Klick auf' +
                                    course.course.name,
                                  documentTitle: 'Schüler Dashboard'
                                })

                                navigate('/single-course', {
                                  state: { course: course.id }
                                })
                              }}
                              key={`appointment-${course.id}`}
                              description={course.course.outline}
                              tags={course.course.tags}
                              date={lecture.start}
                              image={course.course.image}
                              title={course.course.name}
                            />
                          </Column>
                        )
                      }
                    )) || (
                  <AlertMessage
                    content={t('dashboard.myappointments.noappointments')}
                  />
                )}
              </HSection>

              {/* Matches */}
              {(activeMatches?.length > 0 ||
                data?.me?.pupil?.canRequestMatch?.allowed ||
                data?.me?.pupil?.openMatchRequestCount > 0) && (
                <HSection
                  marginBottom={space['1.5']}
                  title={t('dashboard.learningpartner.header')}
                  showAll={activeMatches > 2}
                  wrap>
                  <Flex direction="row" flexWrap="wrap" marginRight="-10px">
                    {activeMatches.map(
                      (match: LFMatch) =>
                        (
                          <Box
                            width={CardGrid}
                            marginRight="10px"
                            marginBottom="10px">
                            <TeacherCard
                              name={`${match.student?.firstname} ${match.student?.lastname}`}
                              variant="dark"
                              tags={
                                match.subjectsFormatted?.map(s => s.name) || []
                              }
                              avatar=""
                              button={
                                (!match.dissolved && (
                                  <Button
                                    variant="outlinelight"
                                    onPress={() => dissolveMatch(match)}>
                                    {t('dashboard.offers.match')}
                                  </Button>
                                )) || (
                                  <Text color="lightText">
                                    {t('matching.status.dissolved')}
                                  </Text>
                                )
                              }
                            />
                          </Box>
                        ) || (
                          <AlertMessage
                            content={t('dashboard.offers.noMatching')}
                          />
                        )
                    )}
                  </Flex>
                  {/* {(data?.me?.pupil?.canRequestMatch?.allowed ||
                    data?.me?.pupil?.openMatchRequestCount > 0) && (
                    <VStack> */}
                  {data?.me?.pupil?.canRequestMatch?.allowed && (
                    <Button
                      width={ButtonContainer}
                      onPress={() => {
                        trackEvent({
                          category: 'dashboard',
                          action: 'click-event',
                          name: 'Schüler Dashboard – Matching anfragen',
                          documentTitle: 'Schüler Dashboard'
                        })
                        navigate('/matching')
                      }}>
                      {t('dashboard.offers.requestMatching')}
                    </Button>
                  )}
                  {data?.me?.pupil?.openMatchRequestCount > 0 && (
                    <VStack space={2} flexShrink={1} maxWidth="700px">
                      {data?.me?.pupil?.firstMatchRequest && (
                        <Text>
                          {t('dashboard.offers.requestCreated')}{' '}
                          {DateTime.fromISO(
                            data?.me?.pupil?.firstMatchRequest
                          ).toFormat('dd.MM.yyyy, HH:mm')}{' '}
                          {t('dashboard.offers.clock')}
                        </Text>
                      )}
                      <Alert
                        maxWidth="520px"
                        alignItems="start"
                        marginY={space['0.5']}
                        colorScheme="info">
                        <HStack space={2} flexShrink={1} alignItems="center">
                          <Alert.Icon color="danger.100" />
                          <Text>{t('dashboard.offers.waitingTimeInfo')}</Text>
                        </HStack>
                      </Alert>

                      <Button
                        width={ButtonContainer}
                        isDisabled={_cancelMatchRequest?.loading}
                        onPress={() => setShowCancelModal(true)}>
                        {t('dashboard.offers.removeRequest')}
                      </Button>
                    </VStack>
                    //   )}
                    // </VStack>
                  )}
                </HSection>
              )}

              {/* Suggestions */}
              <HSection
                marginBottom={space['1.5']}
                title={t('dashboard.relatedcontent.header')}
                onShowAll={() => navigate('/group/offer')}
                showAll={data?.subcoursesPublic?.length > 4}>
                {(data?.subcoursesPublic?.length &&
                  data?.subcoursesPublic
                    ?.slice(0, 4)
                    .map((sc: LFSubCourse, i: number) => (
                      <Column
                        minWidth="230px"
                        maxWidth="280px"
                        flex={1}
                        h="100%">
                        <SignInCard
                          showTrafficLight
                          trafficLightStatus={getTrafficStatus(
                            sc?.participantsCount || 0,
                            sc?.maxParticipants || 0
                          )}
                          tags={sc.course.tags}
                          data={sc}
                          onClickSignIn={() => {
                            trackEvent({
                              category: 'dashboard',
                              action: 'click-event',
                              name: 'Schüler Dashboard – Matching Vorschlag',
                              documentTitle: 'Schüler Dashboard'
                            })
                            navigate('/single-course', {
                              state: { course: sc.id }
                            })
                          }}
                          onPress={() => {
                            trackEvent({
                              category: 'dashboard',
                              action: 'click-event',
                              name: 'Schüler Dashboard – Matching Vorschlag',
                              documentTitle: 'Schüler Dashboard'
                            })
                            navigate('/single-course', {
                              state: { course: sc.id }
                            })
                          }}
                        />
                      </Column>
                    ))) || (
                  <AlertMessage content={t('lernfair.reason.proposals')} />
                )}
              </HSection>
            </VStack>
          </VStack>
        )}
      </WithNavigation>
      <DissolveMatchModal
        showDissolveModal={showDissolveModal}
        onPressDissolve={(reason: string) => {
          dissolve({
            variables: {
              matchId: dissolveData?.id,
              dissolveReason: parseInt(reason)
            }
          })
          setShowDissolveModal(false)
        }}
        onPressBack={() => setShowDissolveModal(false)}
      />
      <CancelMatchRequestModal
        showModal={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onShareFeedback={feedback => cancelMatchRequestReaction(true, feedback)}
        onSkipShareFeedback={() => cancelMatchRequestReaction(false)}
      />
    </AsNavigationItem>
  )
}
export default Dashboard
