import {
  Text,
  Button,
  Heading,
  HStack,
  useTheme,
  VStack,
  useToast,
  useBreakpointValue,
  Flex,
  Column,
  Alert
} from 'native-base'
import { useCallback, useEffect, useMemo, useState } from 'react'
import AppointmentCard from '../../widgets/AppointmentCard'
import HSection from '../../widgets/HSection'
import CTACard from '../../widgets/CTACard'
import WithNavigation from '../../components/WithNavigation'
import { useNavigate } from 'react-router-dom'
import NotificationAlert from '../../components/NotificationAlert'
import { useTranslation } from 'react-i18next'
import { gql, useMutation, useQuery } from '@apollo/client'
import BooksIcon from '../../assets/icons/lernfair/lf-books.svg'
import HelperWizard from '../../widgets/HelperWizard'
import LearningPartner from '../../widgets/LearningPartner'
import { LFMatch } from '../../types/lernfair/Match'
import { LFLecture, LFSubCourse } from '../../types/lernfair/Course'
import { DateTime } from 'luxon'
import { getFirstLectureFromSubcourse } from '../../Utility'
import { useMatomo } from '@jonkoops/matomo-tracker-react'
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner'
import AsNavigationItem from '../../components/AsNavigationItem'
import DissolveMatchModal from '../../modals/DissolveMatchModal'

type Props = {}

const query = gql`
  query {
    me {
      firstname
      student {
        firstMatchRequest
        openMatchRequestCount
        certificateOfConduct {
          id
        }
        canRequestMatch {
          allowed
          reason
        }
        canCreateCourse {
          allowed
          reason
        }
        matches {
          id
          dissolved
          pupil {
            firstname
            grade
            subjectsFormatted {
              name
            }
          }
        }
        subcoursesInstructing {
          id
          published
          lectures {
            start
            duration
          }
          course {
            name
            description
            outline
            tags {
              name
            }
          }
        }
      }
    }

    subcoursesPublic(take: 10, skip: 2) {
      course {
        name
        description
        outline
        tags {
          name
        }
      }
    }
  }
`

const DashboardStudent: React.FC<Props> = () => {
  const toast = useToast()
  const { data, loading, called } = useQuery(query)

  const { space, sizes } = useTheme()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [toastShown, setToastShown] = useState<boolean>()
  const [isMatchRequested, setIsMatchRequested] = useState<boolean>()
  const [showDissolveModal, setShowDissolveModal] = useState<boolean>()
  const [dissolveData, setDissolveData] = useState<LFMatch>()
  const { trackPageView, trackEvent } = useMatomo()

  useEffect(() => {
    trackPageView({
      documentTitle: 'Helfer Dashboard'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [createMatchRequest, matchRequest] = useMutation(
    gql`
      mutation {
        studentCreateMatchRequest
      }
    `,
    {
      refetchQueries: [query]
    }
  )

  const [dissolve, _dissolve] = useMutation(
    gql`
      mutation dissolve($matchId: Float!, $dissolveReason: Float!) {
        matchDissolve(dissolveReason: $dissaolveReason, matchId: $matchId)
      }
    `,
    {
      refetchQueries: [query]
    }
  )

  const requestMatch = useCallback(async () => {
    navigate('/request-match')
  }, [navigate])

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

  const isMobile = useBreakpointValue({ base: true, lg: false })

  const ContainerWidth = useBreakpointValue({
    base: '100%',
    lg: sizes['containerWidth']
  })

  const CardGrid = useBreakpointValue({
    base: '100%',
    lg: '48.3%'
  })

  const ButtonContainer = useBreakpointValue({
    base: '100%',
    lg: sizes['desktopbuttonWidth']
  })

  const publishedSubcourses = useMemo(
    () =>
      data?.me?.student?.subcoursesInstructing.filter(
        (sub: LFSubCourse) => sub.published
      ),
    [data?.me?.student?.subcoursesInstructing]
  )

  const sortedPublishedSubcourses = useMemo(() => {
    if (!publishedSubcourses) return []

    const courses = [...publishedSubcourses]

    courses.sort((a: LFSubCourse, b: LFSubCourse) => {
      const aLecture = getFirstLectureFromSubcourse(a.lectures)
      const bLecture = getFirstLectureFromSubcourse(b.lectures)

      if (bLecture === null) return -1
      if (aLecture === null) return 1

      const aDate = DateTime.fromISO(aLecture.start).toMillis()
      const bDate = DateTime.fromISO(bLecture.start).toMillis()

      if (aDate < DateTime.now().toMillis()) return 1
      if (bDate < DateTime.now().toMillis()) return 1

      if (aDate === bDate) return 0
      return aDate > bDate ? 1 : -1
    })

    return courses
  }, [publishedSubcourses])

  // TODO: Optimizable?
  const nextAppointment:
    | [appointment: LFLecture, course: LFSubCourse]
    | undefined = useMemo(() => {
    if (!data?.me?.student) return undefined

    let firstCourse: LFSubCourse = null!
    let firstDate: DateTime = DateTime.now()
    let firstLecture: LFLecture = null!

    for (const sub of sortedPublishedSubcourses) {
      if (!firstCourse) {
        firstCourse = sub
      }

      let _firstLecture: LFLecture | null = getFirstLectureFromSubcourse(
        sub.lectures
      )
      let _firstDate: DateTime | null =
        _firstLecture && DateTime.fromISO(_firstLecture.start)

      if (!firstLecture) {
        firstLecture = _firstLecture
      }
      if (!firstDate) {
        firstDate = _firstDate
      }

      if (_firstDate && _firstDate.toMillis() < firstDate.toMillis()) {
        firstLecture = _firstLecture
        firstDate = _firstDate
        firstCourse = sub
      }
    }

    return [firstLecture, firstCourse]
  }, [data?.me?.student, sortedPublishedSubcourses])

  const activeMatches = useMemo(
    () =>
      data?.me?.student?.matches.filter((match: LFMatch) => !match.dissolved),
    [data?.me?.student?.matches]
  )

  const onboardingIndex: number = useMemo(() => {
    if (data?.me?.student?.canCreateCourse.reason) return 0
    if (data?.me?.student?.canRequestMatch.reason) return 1
    if (!data?.me?.student?.firstMatchRequest) return 2
    if (!data?.me?.student?.certificateOfConduct?.id) return 3
    return 0
  }, [])

  return (
    <AsNavigationItem path="dashboard">
      <WithNavigation
        headerContent={
          called &&
          !loading && (
            <HStack
              space={space['1']}
              alignItems="center"
              bgColor={isMobile ? 'primary.900' : 'transparent'}
              paddingX={space['1']}>
              {/* <ProfilAvatar
              size="md"
              image="https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
            /> */}
              <Heading color={'#fff'} paddingY={space['1.5']}>
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
            <VStack>
              <VStack marginBottom={space['1.5']}>
                <HelperWizard index={onboardingIndex} />
              </VStack>

              {/* Next Appointment */}
              {data?.me?.student?.subcoursesInstructing?.length > 0 &&
                nextAppointment && (
                  <VStack marginBottom={space['1.5']}>
                    <Heading marginBottom={space['1']}>
                      {t('dashboard.appointmentcard.header')}
                    </Heading>

                    <AppointmentCard
                      onPressToCourse={() => {
                        trackEvent({
                          category: 'dashboard',
                          action: 'click-event',
                          name:
                            'Helfer Dashboard Kachelklick   ' +
                              nextAppointment[1].course?.name || '',
                          documentTitle:
                            'Helfer Dashboard – Nächster Termin ' +
                              nextAppointment[1].course?.name || ''
                        })
                        navigate('/single-course', {
                          state: { course: nextAppointment[1].id }
                        })
                      }}
                      tags={nextAppointment[1].course?.tags}
                      date={nextAppointment[0].start || ''}
                      isTeaser={true}
                      image={nextAppointment[1].course?.image}
                      title={nextAppointment[1].course?.name || ''}
                      description={nextAppointment[1].course?.outline || ''}
                    />
                  </VStack>
                )}
              <HSection
                title={t('dashboard.myappointments.header')}
                marginBottom={space['1.5']}
                showAll={data?.me?.student?.subcoursesInstructing?.length > 4}
                onShowAll={() => navigate('/appointments-archive')}>
                {(sortedPublishedSubcourses?.length > 1 &&
                  sortedPublishedSubcourses
                    ?.slice(0, 4)
                    .map((el: LFSubCourse, i: number) => {
                      const course = el.course
                      if (!course) return <></>

                      const lectures = el.lectures
                      if (!lectures) return <></>

                      const firstLecture =
                        getFirstLectureFromSubcourse(lectures)
                      if (!firstLecture) return <></>

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
                                  'Helfer Dashboard Kachelklick  ' +
                                  course.name,
                                documentTitle:
                                  'Helfer Dashboard – Meine Termin  ' +
                                  course.name
                              })

                              navigate('/single-course', {
                                state: { course: el.id }
                              })
                            }}
                            key={`appointment-${el.id}`}
                            description={course.outline}
                            tags={course.tags}
                            date={firstLecture.start}
                            image={course.image}
                            title={course.name}
                          />
                        </Column>
                      )
                    })) || (
                  <Alert
                    alignItems="start"
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
              <HSection
                title={t('dashboard.helpers.headlines.course')}
                showAll={data?.me?.student?.canCreateCourse?.allowed}
                onShowAll={() => navigate('/course-archive')}
                wrap
                marginBottom={space['1.5']}
                scrollable={false}>
                <Flex direction="row" flexWrap="wrap">
                  {(sortedPublishedSubcourses.length > 0 &&
                    sortedPublishedSubcourses
                      .slice(0, 4)
                      .map((sub: LFSubCourse, index: number) => {
                        const firstLecture = getFirstLectureFromSubcourse(
                          sub.lectures
                        )
                        if (!firstLecture) return <></>
                        return (
                          <Column width={CardGrid} height="auto">
                            <AppointmentCard
                              isFullHeight={false}
                              variant="horizontal"
                              key={index}
                              description={sub.outline}
                              tags={sub.course.tags}
                              date={firstLecture.start}
                              countCourse={sub.lectures.length}
                              onPressToCourse={() => {
                                trackEvent({
                                  category: 'dashboard',
                                  action: 'click-event',
                                  name:
                                    'Helfer Dashboard Kachelklick  ' +
                                    sub.course.name,
                                  documentTitle:
                                    'Helfer Dashboard – Meine Kurse  ' +
                                    sub.course.name
                                })

                                navigate('/single-course', {
                                  state: { course: sub.id }
                                })
                              }}
                              image={sub.course.image}
                              title={sub.course.name}
                            />
                          </Column>
                        )
                      })) ||
                    (data?.me?.student?.canCreateCourse?.allowed ? (
                      <Alert
                        alignItems="start"
                        width="max-content"
                        colorScheme="info">
                        <HStack space={2} flexShrink={1} alignItems="center">
                          <Alert.Icon color="danger.100" />
                          <Text>{t('empty.courses')}</Text>
                        </HStack>
                      </Alert>
                    ) : (
                      ''
                    ))}
                </Flex>
                {(data?.me?.student?.canCreateCourse?.allowed && (
                  <Button
                    marginTop={space['1']}
                    width={ButtonContainer}
                    onPress={() => {
                      trackEvent({
                        category: 'dashboard',
                        action: 'click-event',
                        name: 'Helfer Dashboard Kurse-Erstellen Button',
                        documentTitle: 'Helfer Dashboard – Kurs Button klick'
                      })
                      navigate('/create-course')
                    }}>
                    {t('dashboard.helpers.buttons.course')}
                  </Button>
                )) || (
                  <Alert
                    alignItems="start"
                    width="max-content"
                    colorScheme="warning">
                    <HStack space={2} flexShrink={1} alignItems="center">
                      <Alert.Icon color="danger.100" />
                      <Text>
                        {t(
                          `lernfair.reason.${data?.me?.student?.canCreateCourse?.reason}.course`
                        )}
                      </Text>
                    </HStack>
                  </Alert>
                )}
              </HSection>

              {/* <VStack space={space['0.5']}>
            <Heading marginY={space['1']}>
              {t('dashboard.helpers.headlines.importantNews')}
            </Heading>
            <CTACard
              title={t('dashboard.helpers.headlines.newOffer')}
              closeable={false}
              content={<Text>{t('dashboard.helpers.contents.newOffer')}</Text>}
              button={
                <Button variant="outline">
                  {t('dashboard.helpers.buttons.offer')}
                </Button>
              }
              icon={<PartyIcon />}
            />
          </VStack> */}
              <VStack marginBottom={space['1.5']}>
                <Heading marginBottom={space['1']}>
                  {t('dashboard.helpers.headlines.myLearningPartner')}
                </Heading>
                <Flex direction="row" flexWrap="wrap">
                  {(activeMatches?.length &&
                    activeMatches.map((match: LFMatch, index: number) => (
                      <Column width={CardGrid} marginRight="15px">
                        <LearningPartner
                          key={index}
                          isDark={true}
                          name={match?.pupil?.firstname}
                          subjects={match?.pupil?.subjectsFormatted}
                          schooltype={match?.pupil?.schooltype || ''}
                          schoolclass={match?.pupil?.grade}
                          button={
                            (!match.dissolved && (
                              <Button
                                variant="outlinelight"
                                onPress={() => dissolveMatch(match)}>
                                {t('matching.request.buttons.dissolve')}
                              </Button>
                            )) || (
                              <Text color="lightText">
                                {t('matching.status.dissolved')}
                              </Text>
                            )
                          }
                        />
                      </Column>
                    ))) ||
                    (data?.me?.student?.canRequestMatch?.allowed ? (
                      <Alert
                        alignItems="start"
                        width="max-content"
                        colorScheme="info">
                        <HStack space={2} flexShrink={1} alignItems="center">
                          <Alert.Icon color="danger.100" />
                          <Text>{t('empty.matchings')}</Text>
                        </HStack>
                      </Alert>
                    ) : (
                      ''
                    ))}
                </Flex>
                {(data?.me?.student?.canRequestMatch?.allowed && (
                  <>
                    <Button
                      marginTop={space['1']}
                      width={ButtonContainer}
                      isDisabled={isMatchRequested}
                      marginY={space['1']}
                      onPress={requestMatch}>
                      {t('dashboard.helpers.buttons.requestMatch')}
                    </Button>
                  </>
                )) || (
                  <Alert
                    alignItems="start"
                    width="max-content"
                    marginTop={space['0.5']}
                    marginBottom={space['0.5']}
                    colorScheme="warning">
                    <HStack space={2} flexShrink={1} alignItems="center">
                      <Alert.Icon color="danger.100" />
                      <Text>
                        {' '}
                        {t(
                          `lernfair.reason.${data?.me?.student?.canRequestMatch?.reason}.matching`
                        )}
                      </Text>
                    </HStack>
                  </Alert>
                )}

                <Text>
                  Offene Anfragen:{' '}
                  {`${data?.me?.student?.openMatchRequestCount}`}
                </Text>
              </VStack>
              <VStack marginBottom={space['1.5']}>
                <Heading marginBottom={space['1']}>
                  {t('dashboard.helpers.headlines.recommend')}
                </Heading>
                <CTACard
                  title={t('dashboard.helpers.headlines.recommendFriends')}
                  closeable={false}
                  content={
                    <Text>
                      {t('dashboard.helpers.contents.recommendFriends')}
                    </Text>
                  }
                  button={
                    <Button variant="outline">
                      {t('dashboard.helpers.buttons.recommend')}
                    </Button>
                  }
                  icon={<BooksIcon />}
                />
              </VStack>
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
    </AsNavigationItem>
  )
}
export default DashboardStudent
