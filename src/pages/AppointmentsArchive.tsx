import {
  Text,
  Heading,
  useTheme,
  VStack,
  Input,
  SearchIcon,
  useBreakpointValue,
  Flex,
  Column,
  Spinner,
  Box,
  Row,
  Button
} from 'native-base'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import WithNavigation from '../components/WithNavigation'
import NotificationAlert from '../components/NotificationAlert'
import AppointmentCard from '../widgets/AppointmentCard'
import useLernfair from '../hooks/useLernfair'
import { useEffect, useMemo, useState } from 'react'
import { gql, useQuery } from '@apollo/client'
import { LFLecture, LFSubCourse } from '../types/lernfair/Course'
import { DateTime } from 'luxon'
import { useMatomo } from '@jonkoops/matomo-tracker-react'

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
            outline
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
            outline
            tags {
              name
            }
          }
        }
      }
    }
  }
`

const AppointmentsArchive: React.FC<Props> = () => {
  const { space, sizes } = useTheme()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { userType } = useLernfair()

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

  const sortedSearchResults: { course: LFSubCourse; lecture: LFLecture }[] =
    useMemo(() => {
      const lectures: { course: LFSubCourse; lecture: LFLecture }[] = []
      for (const sub of searchResults) {
        for (const lecture of sub.lectures) {
          lectures.push({ course: sub, lecture })
        }
      }

      return lectures.sort((a, b) => {
        const _a = DateTime.fromISO(a.lecture.start).toMillis()
        const _b = DateTime.fromISO(b.lecture.start).toMillis()

        if (_a > _b) return 1
        else if (_a < _b) return -1
        else return 0
      })
    }, [searchResults])

  useEffect(() => {
    trackPageView({
      documentTitle: 'Termine Archive',
      href: '/appointment-archive'
    })
  }, [])

  const ContainerWidth = useBreakpointValue({
    base: '100%',
    lg: sizes['containerWidth']
  })

  const CardGrid = useBreakpointValue({
    base: '100%',
    lg: '47%'
  })

  const { trackPageView } = useMatomo()

  useEffect(() => {
    trackPageView({
      documentTitle: 'Termin Archive'
    })
  }, [])

  return (
    <WithNavigation
      headerTitle={t('archive.appointments.header')}
      headerLeft={<NotificationAlert />}>
      <VStack paddingX={space['1']} width={ContainerWidth}>
        <VStack space={space['1']}>
          <VStack space={space['0.5']}>
            <Heading>{t('archive.appointments.title')}</Heading>
            <Text>{t('archive.appointments.content')}</Text>
          </VStack>
          <Row paddingY={space['1']}>
            <Input
              flex="1"
              size="lg"
              placeholder={t('matching.group.helper.support.search')}
              onChangeText={setSearchString}
            />
            <Button padding={space['1']}>
              <SearchIcon />
            </Button>
          </Row>
          <VStack flex="1">
            {loading && (
              <Box mt="5">
                <Spinner />
              </Box>
            )}
            {!loading && (
              <>
                {(sortedSearchResults.length > 0 && (
                  <Flex direction="row" flexWrap="wrap">
                    {sortedSearchResults.map(
                      (
                        {
                          course: sub,
                          lecture
                        }: { course: LFSubCourse; lecture: LFLecture },
                        index: number
                      ) => {
                        return (
                          <Column
                            width={CardGrid}
                            marginRight="15px"
                            key={index}>
                            <AppointmentCard
                              key={index}
                              variant="horizontal"
                              description={sub.course.outline}
                              tags={sub.course.tags}
                              date={lecture.start}
                              countCourse={sub.lectures.length}
                              onPressToCourse={() =>
                                navigate('/single-course', {
                                  state: { course: sub.id }
                                })
                              }
                              image={sub.course.image}
                              title={sub.course.name}
                            />
                          </Column>
                        )
                      }
                    )}
                  </Flex>
                )) || <Text>Es wurden keine Ergebnisse gefunden.</Text>}
              </>
            )}
          </VStack>
        </VStack>
      </VStack>
    </WithNavigation>
  )
}
export default AppointmentsArchive
