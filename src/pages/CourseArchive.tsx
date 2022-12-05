import {
  Text,
  Heading,
  useTheme,
  VStack,
  Input,
  useBreakpointValue,
  Flex,
  Column,
  Row,
  Spinner,
  Box,
  Alert,
  HStack
} from 'native-base'

import { useTranslation } from 'react-i18next'
import WithNavigation from '../components/WithNavigation'
import NotificationAlert from '../components/Notification/NotificationAlert'
import AppointmentCard from '../widgets/AppointmentCard'
import { gql, useQuery } from '@apollo/client'
import { useEffect, useMemo, useState } from 'react'
import { LFSubCourse } from '../types/lernfair/Course'
import useLernfair from '../hooks/useLernfair'
import { DateTime } from 'luxon'
import { useNavigate } from 'react-router-dom'
import { useMatomo } from '@jonkoops/matomo-tracker-react'
import AlertMessage from '../widgets/AlertMessage'
import CSSWrapper from '../components/CSSWrapper'
import { useUserType } from '../hooks/useApollo'

type Props = {}

const studentQuery = gql`
  query {
    me {
      student {
        subcoursesInstructing {
          id
          lectures {
            start
          }
          course {
            name
            image
            tags {
              name
            }
          }
        }
      }
    }
  }
`
const pupilQuery = gql`
  query {
    me {
      pupil {
        subcoursesJoined {
          id
          lectures {
            start
          }
          course {
            name
            image
            tags {
              name
            }
          }
        }
      }
    }
  }
`

const CourseArchive: React.FC<Props> = () => {
  const { space, sizes } = useTheme()
  const navigate = useNavigate()
  const userType = useUserType()

  const { t } = useTranslation()
  const { trackPageView, trackEvent } = useMatomo()

  useEffect(() => {
    trackPageView({
      documentTitle: 'Kurs Archive'
    })
  }, [])

  const ContainerWidth = useBreakpointValue({
    base: '100%',
    lg: sizes['containerWidth']
  })

  // const ButtonContainer = useBreakpointValue({
  //   base: '100%',
  //   lg: sizes['desktopbuttonWidth']
  // })

  const CardGrid = useBreakpointValue({
    base: '100%',
    lg: '47%'
  })

  const [searchString, setSearchString] = useState<string>('')

  const { loading, data } = useQuery(
    userType === 'student' ? studentQuery : pupilQuery
  )

  const searchResults = useMemo(() => {
    let obj
    if (userType === 'student') {
      obj = data?.me?.student?.subcoursesInstructing
    } else {
      obj = data?.me?.pupil?.subcoursesJoined
    }

    return (
      obj?.filter((sub: LFSubCourse) =>
        sub.course.name.toLowerCase().includes(searchString.toLowerCase())
      ) || []
    )
  }, [
    data?.me?.pupil?.subcoursesJoined,
    data?.me?.student?.subcoursesInstructing,
    userType,
    searchString
  ])

  const ContentContainerWidth = useBreakpointValue({
    base: '100%',
    lg: sizes['contentContainerWidth']
  })

  return (
    <WithNavigation
      headerTitle={t('archive.course.header')}
      headerLeft={<NotificationAlert />}>
      <VStack
        paddingX={space['1']}
        marginX="auto"
        marginBottom={space['2.5']}
        width="100%"
        maxWidth={ContainerWidth}>
        <VStack space={space['1']}>
          <VStack space={space['0.5']}>
            <Heading>{t('archive.course.title')}</Heading>
            <Text maxWidth={ContentContainerWidth}>
              {t('archive.course.content')}
            </Text>
          </VStack>
          <Row paddingY={space['1']} maxWidth={ContentContainerWidth}>
            <Input
              flex="1"
              size="lg"
              placeholder={t('matching.group.helper.support.search')}
              onChangeText={setSearchString}
            />
          </Row>
          <VStack space={space['1']}>
            <Heading>{t('archive.course.sectionHeadline')}</Heading>
            <Text maxWidth={ContentContainerWidth}>
              {t('archive.course.sectionContent')}
            </Text>
          </VStack>
          <VStack flex="1">
            {loading && (
              <Box mt="5">
                <Spinner />
              </Box>
            )}
            {!loading && (
              <>
                {(searchResults.length && (
                  <CSSWrapper className="course-list__wrapper">
                    {searchResults.map((sub: LFSubCourse, index: number) => {
                      let firstDate: DateTime = null!

                      for (const lecture of sub.lectures) {
                        const date = DateTime.fromISO(lecture.start)
                        if (!firstDate) {
                          firstDate = date
                          continue
                        }

                        if (
                          date.diff(firstDate).toMillis() < firstDate.toMillis()
                        ) {
                          firstDate = date
                        }
                      }

                      return (
                        <CSSWrapper className="course-list__item">
                          <AppointmentCard
                            isFullHeight
                            isSpaceMarginBottom={false}
                            variant="horizontal"
                            description={sub.course.description}
                            tags={sub.course.tags}
                            date={firstDate?.toString()}
                            countCourse={sub.lectures.length}
                            onPressToCourse={() => {
                              trackEvent({
                                category: 'kurse',
                                action: 'click-event',
                                name:
                                  'Kurs Archive – Kachel: ' + sub.course.name,
                                documentTitle: 'Kurse Archive'
                              })
                              navigate('/single-course', {
                                state: { course: sub.id }
                              })
                            }}
                            image={sub.course.image}
                            title={sub.course.name}
                          />
                        </CSSWrapper>
                      )
                    })}
                  </CSSWrapper>
                )) || <AlertMessage content={t('empty.courses')} />}
              </>
            )}
          </VStack>
        </VStack>
      </VStack>
    </WithNavigation>
  )
}
export default CourseArchive
