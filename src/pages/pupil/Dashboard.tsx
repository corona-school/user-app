import {
  Text,
  Button,
  Heading,
  HStack,
  useTheme,
  VStack,
  useBreakpointValue,
  Pressable,
  Flex,
  Column,
  Spinner,
  Modal,
  useToast,
  Row,
  Alert
} from 'native-base'
import { useCallback, useEffect, useMemo, useState } from 'react'
import AppointmentCard from '../../widgets/AppointmentCard'
import HSection from '../../widgets/HSection'
import SignInCard from '../../widgets/SignInCard'
import ProfilAvatar from '../../widgets/ProfilAvatar'
import TeacherCard from '../../widgets/TeacherCard'
import WithNavigation from '../../components/WithNavigation'
import { useNavigate } from 'react-router-dom'
import NotificationAlert from '../../components/NotificationAlert'
import { useTranslation } from 'react-i18next'
import { gql, useMutation, useQuery } from '@apollo/client'
import { LFCourse, LFLecture, LFSubCourse } from '../../types/lernfair/Course'

import { LFMatch } from '../../types/lernfair/Match'
import { DateTime } from 'luxon'
import { useMatomo } from '@jonkoops/matomo-tracker-react'
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner'
import { getFirstLectureFromSubcourse } from '../../Utility'
import AsNavigationItem from '../../components/AsNavigationItem'

type Props = {}

const query = gql`
  query {
    me {
      firstname
      pupil {
        matches {
          id
          dissolved
          student {
            id
            firstname
            lastname
          }
        }
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
  const [showDissolveModal, setShowDissolveModal] = useState<boolean>()
  const [dissolveData, setDissolveData] = useState<LFMatch>()
  const [toastShown, setToastShown] = useState<boolean>()

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

  const [dissolve, _dissolve] = useMutation(
    gql`
      mutation dissolve($matchId: Float!) {
        matchDissolve(dissolveReason: 1.0, matchId: $matchId)
      }
    `,
    {
      refetchQueries: [query]
    }
  )

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

  return (
    <AsNavigationItem path="dashboard">
      <WithNavigation
        headerContent={
          !loading && (
            <HStack
              maxWidth={ContainerWidth}
              space={space['1']}
              alignItems="center"
              bgColor={isMobile ? 'primary.900' : 'transparent'}
              padding={space['0.5']}>
              {/* <ProfilAvatar
                size="md"
                image="https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
              /> */}
              <Heading color={'#fff'}>
                {t('hallo')} {data?.me?.firstname}!
              </Heading>
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
            <VStack space={space['1']} marginTop={space['1']}>
              {sortedAppointments[0] && (
                <VStack space={space['0.5']}>
                  <Heading marginY={space['1']}>
                    {t('dashboard.appointmentcard.header')}
                  </Heading>

                  <AppointmentCard
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
                    tags={sortedAppointments[0]?.course?.course?.tags}
                    date={sortedAppointments[0]?.lecture.start}
                    image={sortedAppointments[0]?.course.course?.image}
                    title={sortedAppointments[0]?.course.course?.name}
                    description={sortedAppointments[0]?.course.course?.outline}
                  />
                </VStack>
              )}

              {/* Appointments */}
              <HSection
                title={t('dashboard.myappointments.header')}
                showAll={data?.me?.pupil?.subcoursesJoined?.length > 4}
                onShowAll={() => navigate('/appointments-archive')}>
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
                  <Alert
                    alignItems="start"
                    marginY={space['1']}
                    width="max-content"
                    colorScheme="info">
                    <HStack space={2} flexShrink={1} alignItems="center">
                      <Alert.Icon color="danger.100" />
                      <Text>
                        {t('dashboard.myappointments.noappointments')}
                      </Text>
                    </HStack>
                  </Alert>
                )}
              </HSection>

              {/* Matches */}
              <HSection
                title={t('dashboard.learningpartner.header')}
                showAll={data?.me?.pupil?.matches?.length > 2}
                wrap>
                <Flex direction="row" flexWrap="wrap" marginRight="-10px">
                  {data?.me?.pupil?.matches?.slice(0, 2).map(
                    (match: LFMatch) =>
                      (
                        <Pressable
                          width={CardGrid}
                          marginRight="10px"
                          marginBottom="10px"
                          onPress={() =>
                            navigate('/profile', {
                              state: {
                                userType: 'student',
                                id: match.student.id
                              }
                            })
                          }>
                          <TeacherCard
                            name={`${match.student?.firstname} ${match.student?.lastname}`}
                            variant="dark"
                            tags={
                              match.subjectsFormatted?.map(s => s.name) || [
                                'Fehler',
                                'Backend',
                                'Permission'
                              ]
                            }
                            avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
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
                        </Pressable>
                      ) || (
                        <Alert
                          alignItems="start"
                          marginY={space['1']}
                          width="max-content"
                          colorScheme="info">
                          <HStack space={2} flexShrink={1} alignItems="center">
                            <Alert.Icon color="danger.100" />
                            <Text>{t('dashboard.offers.noMatching')}</Text>
                          </HStack>
                        </Alert>
                      )
                  )}
                </Flex>
                <VStack space={space['0.5']} mt="3">
                  {(data?.me?.pupil?.canRequestMatch?.allowed && (
                    <Button
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
                  )) || (
                    <Alert
                      alignItems="start"
                      marginY={space['1']}
                      width="max-content"
                      colorScheme="info">
                      <HStack space={2} flexShrink={1} alignItems="center">
                        <Alert.Icon color="danger.100" />
                        <Text>
                          {t(
                            `lernfair.reason.${data?.me?.pupil?.canRequestMatch?.reason}.matching`
                          )}
                        </Text>
                      </HStack>
                    </Alert>
                  )}
                  <Text>
                    Offene Anfragen:{' '}
                    {`${data?.me?.pupil?.openMatchRequestCount}`}
                  </Text>
                </VStack>
              </HSection>

              {/* Suggestions */}

              <HSection
                title={t('dashboard.relatedcontent.header')}
                onShowAll={() => navigate('/group/offer')}
                showAll={data?.subcoursesPublic?.length > 4}>
                {(data?.subcoursesPublic?.length &&
                  data?.subcoursesPublic
                    ?.slice(0, 4)
                    .map((sc: LFSubCourse, i: number) => (
                      <SignInCard
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
                    ))) || (
                  <Alert
                    alignItems="start"
                    marginY={space['1']}
                    width="max-content"
                    colorScheme="info">
                    <HStack space={2} flexShrink={1} alignItems="center">
                      <Alert.Icon color="danger.100" />
                      <Text>{t('lernfair.reason.proposals')}</Text>
                    </HStack>
                  </Alert>
                )}
              </HSection>
            </VStack>
          </VStack>
        )}
      </WithNavigation>
      <Modal isOpen={showDissolveModal}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Match auflösen</Modal.Header>
          <Modal.Body>
            <VStack>
              <Text>
                Möchtest du das Match mit{' '}
                <Text bold>{dissolveData?.student.firstname}</Text> wirklich
                auflösen?
              </Text>
            </VStack>
          </Modal.Body>
          <Modal.Footer>
            <Row space={space['1']}>
              <Button
                onPress={() => {
                  dissolve({ variables: { matchId: dissolveData?.id } })
                  setShowDissolveModal(false)
                }}>
                Match auflösen
              </Button>
              <Button onPress={() => setShowDissolveModal(false)}>
                Zurück
              </Button>
            </Row>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </AsNavigationItem>
  )
}
export default Dashboard
