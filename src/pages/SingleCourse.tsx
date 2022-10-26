import {
  Box,
  Heading,
  useTheme,
  Text,
  Image,
  Column,
  Row,
  Button,
  useBreakpointValue
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
import { gql, useQuery } from '@apollo/client'
import { DateTime } from 'luxon'
import useLernfair from '../hooks/useLernfair'
import { useEffect, useMemo } from 'react'
import { useMatomo } from '@jonkoops/matomo-tracker-react'

type Props = {}

const SingleCourse: React.FC<Props> = () => {
  const { space, sizes } = useTheme()
  const { t } = useTranslation()

  const location = useLocation()
  const { course: courseId } = (location.state || {}) as { course: LFSubCourse }
  const { userType } = useLernfair()
  console.log(userType)
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
  canJoin{
    allowed
    reason
    limit
  }`

  const {
    data: courseData,
    loading,
    error
  } = useQuery(gql`query{
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
  }`)

  const course = courseData?.subcourse

  const participants = useMemo(
    () =>
      userType === 'student' ? course?.participants : course?.otherParticipants,
    [course?.otherParticipants, course?.participants, userType]
  )

  const ContainerWidth = useBreakpointValue({
    base: '100%',
    lg: sizes['containerWidth']
  })

  const ButtonContainer = useBreakpointValue({
    base: '100%',
    lg: sizes['desktopbuttonWidth']
  })

  const { trackPageView, trackEvent } = useMatomo()

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
            source={{
              uri:
                course?.course?.image ||
                'https://images.unsplash.com/photo-1632571401005-458e9d244591?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1742&q=80'
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
          {Utility.formatDate(course?.lectures[0].start)}
          {t('single.global.clock')}
        </Text>
        <Heading paddingBottom={space['1']}>{course?.course?.name}</Heading>
        <Row alignItems="center" paddingBottom={space['1']}>
          <ProfilAvatar
            size="sm"
            image="https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
          />
          <Heading marginLeft={space['0.5']} fontSize="md">
            Max Mustermann
          </Heading>
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
                      {t('single.global.category')}:
                    </Text>
                    <Text>{course?.course?.category}</Text>
                  </Row>
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
                  {(course.lectures.length > 0 &&
                    course?.lectures?.map((lec: LFLecture, i: number) => (
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
                          <Text bold>Dauer: </Text> {lec?.duration / 60} Stunden
                        </Text>
                      </Row>
                    ))) || <Text>Es wurden keine Lektionen eingetragen.</Text>}
                </>
              )
            },
            {
              title: t('single.tabs.participant'),
              content: (
                <>
                  {(participants.length > 0 &&
                    participants.map((p: any) => (
                      <Row marginBottom={space['1.5']} alignItems="center">
                        <Column marginRight={space['1']}>
                          <ProfilAvatar
                            size="md"
                            image="https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                          />
                        </Column>
                        <Column>
                          <Heading fontSize="md">{p.firstname}</Heading>
                          <Text>{p.grade}</Text>
                        </Column>
                      </Row>
                    ))) || (
                    <Text>Es sind noch keine Teilnehmer vorhanden.</Text>
                  )}
                </>
              )
            }
          ]}
        />

        {userType === 'pupil' && (
          <Box marginBottom={space['0.5']}>
            {!course?.canJoin?.allowed && (
              <Text>{course?.canJoin?.reason}</Text>
            )}
            <Button
              onPress={() => {
                trackEvent({
                  category: 'kurs',
                  action: 'click-event',
                  name: 'Kurs anmelden | ' + course?.course?.name,
                  documentTitle: 'Kurs anmelden  | ' + course?.course?.name
                })
              }}
              width={ButtonContainer}
              marginBottom={space['0.5']}
              isDisabled={!course?.canJoin?.allowed}>
              {t('single.button.login')}
            </Button>
          </Box>
        )}
        {course?.allowContact && (
          <Box marginBottom={space['1.5']}>
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
