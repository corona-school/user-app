import {
  Text,
  Button,
  Heading,
  HStack,
  useTheme,
  VStack,
  useBreakpointValue,
  Flex,
  Column
} from 'native-base'
import { useEffect, useMemo, useState } from 'react'
import AppointmentCard from '../../widgets/AppointmentCard'
import HSection from '../../widgets/HSection'
import SignInCard from '../../widgets/SignInCard'
import ProfilAvatar from '../../widgets/ProfilAvatar'
import TeacherCard from '../../widgets/TeacherCard'
import WithNavigation from '../../components/WithNavigation'
import { useNavigate } from 'react-router-dom'
import NotificationAlert from '../../components/NotificationAlert'
import { useTranslation } from 'react-i18next'
import { gql, useQuery } from '@apollo/client'
import { LFLecture, LFSubCourse } from '../../types/lernfair/Course'

import { LFMatch } from '../../types/lernfair/Match'
import { DateTime } from 'luxon'
import { useMatomo } from '@jonkoops/matomo-tracker-react'

type Props = {}

const query = gql`
  query {
    me {
      firstname
      pupil {
        matches {
          student {
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

    subcoursesPublic(take: 20, skip: 2, excludeKnown: true) {
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
  // ,
  //   {
  //     refetchQueries: [query]
  //   }
  const { data, loading } = useQuery(query)

  const { space, sizes } = useTheme()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { trackPageView, trackEvent } = useMatomo()

  useEffect(() => {
    trackPageView({
      documentTitle: 'Schüler – Dashboard'
    })
  }, [])

  const ContainerWidth = useBreakpointValue({
    base: '100%',
    lg: sizes['containerWidth']
  })

  const CardGrid = useBreakpointValue({
    base: '100%',
    lg: '48.3%'
  })

  const sortedAppointments: { course: LFSubCourse; lecture: LFLecture }[] =
    useMemo(() => {
      const lectures: { course: LFSubCourse; lecture: LFLecture }[] = []

      if (!data?.me?.pupil?.subcoursesJoined) return []

      for (const sub of data?.me?.pupil?.subcoursesJoined) {
        for (const lecture of sub.lectures) {
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

  if (loading) return <></>

  return (
    <WithNavigation
      headerContent={
        <HStack
          maxWidth={ContainerWidth}
          space={space['1']}
          alignItems="center"
          bgColor={'primary.900'}
          padding={space['0.5']}>
          <ProfilAvatar
            size="md"
            image="https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
          />
          <Heading color={'#fff'}>
            {t('hallo')} {data?.me?.firstname}!
          </Heading>
        </HStack>
      }
      headerLeft={<NotificationAlert />}>
      <VStack paddingX={space['1']} maxWidth={ContainerWidth}>
        <VStack space={space['1']} marginTop={space['1']}>
          {sortedAppointments[0] && (
            <VStack space={space['0.5']}>
              <Heading marginY={space['1']}>
                {t('dashboard.appointmentcard.header')}
              </Heading>

              <AppointmentCard
                isTeaser
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
            {(sortedAppointments?.length &&
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
                      <AppointmentCard
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
                    )
                  }
                )) || (
              <VStack space={space['0.5']}>
                <Text>Du bist für keine Kurse eingetragen.</Text>
                <Button onPress={() => navigate('/course-archive')}>
                  Zur Kursübersicht
                </Button>
              </VStack>
            )}
          </HSection>
          {/* Matches */}
          <HSection
            title={t('dashboard.learningpartner.header')}
            showAll={data?.me?.pupil?.matches?.length > 2}
            wrap>
            <Flex direction="row" flexWrap="wrap">
              {data?.me?.pupil?.matches?.slice(0, 2).map(
                (match: LFMatch) =>
                  (
                    <Column width={CardGrid} marginRight="15px">
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
                          <Button variant="outlinelight">
                            {t('dashboard.offers.match')}
                          </Button>
                        }
                      />
                    </Column>
                  ) || <Text>{t('dashboard.offers.noMatching')}</Text>
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
                <Text>
                  {t(
                    `lernfair.reason.${data?.me?.pupil?.canRequestMatch?.reason}.matching`
                  )}
                </Text>
              )}
              <Text fontSize="xs">
                Offene Anfragen: {`${data?.me?.pupil?.openMatchRequestCount}`}
              </Text>
            </VStack>
          </HSection>

          {/* Suggestions */}
          <HSection title={t('dashboard.relatedcontent.header')} showAll={true}>
            {(data?.subcoursesPublic?.length &&
              data?.subcoursesPublic?.map((sc: LFSubCourse, i: number) => (
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
                    navigate('/single-course', { state: { course: sc.id } })
                  }}
                  onPress={() => {
                    trackEvent({
                      category: 'dashboard',
                      action: 'click-event',
                      name: 'Schüler Dashboard – Matching Vorschlag',
                      documentTitle: 'Schüler Dashboard'
                    })
                    navigate('/single-course', { state: { course: sc.id } })
                  }}
                />
              ))) || <Text>Es wurden keine Vorschläge für dich gefunden.</Text>}
          </HSection>
        </VStack>
      </VStack>
    </WithNavigation>
  )
}
export default Dashboard
