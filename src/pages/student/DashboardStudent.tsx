import {
  Text,
  Button,
  Heading,
  HStack,
  useTheme,
  VStack,
  Modal,
  Row,
  useToast,
  useBreakpointValue,
  Flex,
  Column
} from 'native-base'
import { useCallback, useEffect, useMemo, useState } from 'react'
import AppointmentCard from '../../widgets/AppointmentCard'
import HSection from '../../widgets/HSection'
import CTACard from '../../widgets/CTACard'
import ProfilAvatar from '../../widgets/ProfilAvatar'
import WithNavigation from '../../components/WithNavigation'
import { useNavigate } from 'react-router-dom'
import NotificationAlert from '../../components/NotificationAlert'
import { useTranslation } from 'react-i18next'
import { gql, useMutation, useQuery } from '@apollo/client'
import BooksIcon from '../../assets/icons/lernfair/lf-books.svg'
import PartyIcon from '../../assets/icons/lernfair/lf-pary-small.svg'
import HelperWizard from '../../widgets/HelperWizard'
import LearningPartner from '../../widgets/LearningPartner'
import { LFMatch } from '../../types/lernfair/Match'
import { LFLecture, LFSubCourse } from '../../types/lernfair/Course'
import { DateTime } from 'luxon'
import { getFirstLectureFromSubcourse, TIME_THRESHOLD } from '../../Utility'

type Props = {}

const query = gql`
  query {
    me {
      firstname
      student {
        openMatchRequestCount
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
  const { data, loading } = useQuery(query)

  const { space, sizes } = useTheme()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [toastShown, setToastShown] = useState<boolean>()
  const [isMatchRequested, setIsMatchRequested] = useState<boolean>()
  const [showDissolveModal, setShowDissolveModal] = useState<boolean>()
  const [dissolveData, setDissolveData] = useState<LFMatch>()

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
      mutation dissolve($matchId: Float!) {
        matchDissolve(dissolveReason: 1.0, matchId: $matchId)
      }
    `,
    {
      refetchQueries: [query]
    }
  )

  const requestMatch = useCallback(async () => {
    setIsMatchRequested(true)
    const res = (await createMatchRequest()) as {
      data: {
        studentCreateMatchRequest: boolean
      }
    }
    setIsMatchRequested(res?.data?.studentCreateMatchRequest)
  }, [createMatchRequest])

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

  // TODO: Optimizable?
  const nextAppointment: [
    appointment: Partial<LFLecture>,
    course: Partial<LFSubCourse>
  ] = useMemo(() => {
    if (!data?.me?.student) return [{}, {}]

    let firstCourse: LFSubCourse = null!
    let firstDate: DateTime = DateTime.now()
    let firstLecture: LFLecture = null!

    for (const sub of data?.me?.student?.subcoursesInstructing) {
      let _firstDate: DateTime = DateTime.now()
      let _firstLecture: LFLecture = null!

      for (const lecture of sub.lectures) {
        const date = DateTime.fromISO(lecture.start)

        if (date.toMillis() < _firstDate.toMillis()) {
          _firstDate = date
          _firstLecture = lecture
        }
      }

      if (firstCourse !== sub) {
        if (_firstDate.toMillis() < firstDate.toMillis()) {
          firstDate = _firstDate
          firstLecture = _firstLecture
          firstCourse = sub
        }
      }
    }

    return [firstLecture || {}, firstCourse || {}]
  }, [data?.me?.student])

  if (loading) return <></>

  return (
    <>
      <WithNavigation
        headerContent={
          <HStack
            space={space['1']}
            alignItems="center"
            bgColor={'primary.900'}
            paddingX={space['1']}>
            {/* <ProfilAvatar
              size="md"
              image="https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
            /> */}
            <Heading color={'#fff'} paddingY={space['1.5']}>
              {t('hallo')} {data?.me?.firstname}!
            </Heading>
          </HStack>
        }
        headerLeft={<NotificationAlert />}>
        <VStack paddingX={space['1']} width={ContainerWidth}>
          <VStack space={space['1']} marginTop={space['1']}>
            <VStack paddingY={space['1']}>
              <HelperWizard index={0} />
            </VStack>

            {/* Next Appointment */}
            {data?.me?.student?.subcoursesInstructing?.length > 0 &&
              nextAppointment && (
                <VStack space={space['0.5']}>
                  <Heading marginY={space['1']}>
                    {t('dashboard.appointmentcard.header')}
                  </Heading>

                  <AppointmentCard
                    onPressToCourse={() =>
                      navigate('/single-course', {
                        state: { course: nextAppointment[1].id }
                      })
                    }
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
              showAll={data?.me?.student?.subcoursesInstructing?.length > 0}
              onShowAll={() => navigate('/appointments-archive')}>
              {(data?.me?.student?.subcoursesInstructing?.length &&
                data?.me?.student?.subcoursesInstructing
                  ?.slice(0, 5)
                  .map((el: LFSubCourse, i: number) => {
                    const course = el.course
                    if (!course) return <></>

                    const lectures = el.lectures
                    if (!lectures) return <></>

                    const firstLecture = getFirstLectureFromSubcourse(lectures)
                    if (!firstLecture) return <></>

                    return (
                      <AppointmentCard
                        onPressToCourse={() =>
                          navigate('/single-course', {
                            state: { course: el.id }
                          })
                        }
                        key={`appointment-${el.id}`}
                        description={course.outline}
                        tags={course.tags}
                        date={firstLecture.start}
                        image={course.image}
                        title={course.name}
                      />
                    )
                  })) || <Text>{t('empty.appointments')}</Text>}
            </HSection>
            <HSection
              title={t('dashboard.helpers.headlines.course')}
              showAll={data?.me?.student?.canCreateCourse?.allowed}
              onShowAll={() => navigate('/course-archive')}
              wrap
              scrollable={false}>
              {(data?.me?.student?.subcoursesInstructing.length > 0 &&
                data?.me?.student?.subcoursesInstructing
                  .slice(0, 5)
                  .map((sub: LFSubCourse, index: number) => {
                    const firstLecture = getFirstLectureFromSubcourse(
                      sub.lectures
                    )
                    if (!firstLecture) return <></>
                    return (
                      <AppointmentCard
                        variant="horizontal"
                        key={index}
                        description={sub.outline}
                        tags={sub.course.tags}
                        date={firstLecture.start}
                        countCourse={sub.lectures.length}
                        onPressToCourse={() => alert('YES')}
                        image={sub.course.image}
                        title={sub.course.name}
                      />
                    )
                  })) || (
                <VStack space={space['0.5']}>
                  <Text>{t('empty.courses')}</Text>
                </VStack>
              )}
              {(data?.me?.student?.canCreateCourse?.allowed && (
                <Button
                  width={ButtonContainer}
                  marginY={space['1']}
                  onPress={() => navigate('/create-course')}>
                  {t('dashboard.helpers.buttons.course')}
                </Button>
              )) || (
                <Text mt={space['0.5']} fontSize="xs" opacity=".8">
                  {t(
                    `lernfair.reason.${data?.me?.student?.canCreateCourse?.reason}.course`
                  )}
                </Text>
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
            <VStack space={space['0.5']}>
              <Heading marginY={space['1']}>
                {t('dashboard.helpers.headlines.myLearningPartner')}
              </Heading>
              <Flex direction="row" flexWrap="wrap">
                {(data?.me?.student?.matches?.length &&
                  data?.me?.student?.matches.map(
                    (match: LFMatch, index: number) => (
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
                    )
                  )) || <Text>{t('empty.matchings')}</Text>}
              </Flex>
              {(data?.me?.student?.canRequestMatch?.allowed && (
                <>
                  <Button
                    isDisabled={isMatchRequested}
                    marginY={space['1']}
                    onPress={requestMatch}>
                    {t('dashboard.helpers.buttons.requestMatch')}
                  </Button>
                  {(data?.me?.pupil?.openMatchRequestCount ||
                    isMatchRequested) && (
                    <Text fontSize="xs">
                      Offene Anfragen:{' '}
                      {`${
                        data?.me?.pupil?.openMatchRequestCount ||
                        (isMatchRequested ? 1 : 0)
                      }`}
                    </Text>
                  )}
                </>
              )) || (
                <Text mt={space['0.5']} fontSize="xs" opacity=".8">
                  {t(
                    `lernfair.reason.${data?.me?.student?.canRequestMatch?.reason}.matching`
                  )}
                </Text>
              )}
            </VStack>
            <VStack space={space['0.5']} marginBottom={space['1.5']}>
              <Heading marginY={space['1']}>
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
      </WithNavigation>
      <Modal isOpen={showDissolveModal}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Match auflösen</Modal.Header>
          <Modal.Body>
            <VStack>
              <Text>
                Möchtest du das Match mit{' '}
                <Text bold>{dissolveData?.pupil.firstname}</Text> wirklich
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
    </>
  )
}
export default DashboardStudent
