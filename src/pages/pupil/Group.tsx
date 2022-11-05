import {
  Text,
  Heading,
  useTheme,
  VStack,
  useBreakpointValue,
  Column,
  Flex,
  Box
} from 'native-base'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import WithNavigation from '../../components/WithNavigation'
import NotificationAlert from '../../components/NotificationAlert'
import AppointmentCard from '../../widgets/AppointmentCard'
import Tabs, { Tab } from '../../components/Tabs'
import { useMatomo } from '@jonkoops/matomo-tracker-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import AsNavigationItem from '../../components/AsNavigationItem'
import SearchBar from '../../components/SearchBar'
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner'
import { gql, useLazyQuery, useQuery } from '@apollo/client'
import { LFLecture, LFSubCourse } from '../../types/lernfair/Course'
import { getFirstLectureFromSubcourse } from '../../Utility'
import { DateTime } from 'luxon'
import Hello from '../../widgets/Hello'
import AlertMessage from '../../widgets/AlertMessage'
import CSSWrapper from '../../components/CSSWrapper'

type Props = {}

const query = gql`
  query {
    me {
      pupil {
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
  }
`

const PupilGroup: React.FC<Props> = () => {
  const { space, sizes } = useTheme()

  const ContainerWidth = useBreakpointValue({
    base: '100%',
    lg: sizes['containerWidth']
  })

  const ContentContainerWidth = useBreakpointValue({
    base: '100%',
    lg: sizes['contentContainerWidth']
  })

  const CardGrid = useBreakpointValue({
    base: '100%',
    lg: '48%'
  })

  const navigate = useNavigate()
  const { t } = useTranslation()
  const { trackPageView } = useMatomo()

  const [lastSearch, setLastSearch] = useState<string>('')
  const [activeTab, setActiveTab] = useState<number>(0)

  const { data, loading } = useQuery(query)

  const [
    searchAllSubcoursesQuery,
    { loading: allSubcoursesSearchLoading, data: allSubcoursesData }
  ] = useLazyQuery(gql`
    query ($name: String) {
      subcoursesPublic(search: $name, take: 20, excludeKnown: false) {
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
  `)

  const [
    searchRecommendationsQuery,
    { loading: recommendationsSearchLoading, data: recommendationsData }
  ] = useLazyQuery(gql`
    query ($name: String) {
      subcoursesPublic(search: $name, take: 20, excludeKnown: false) {
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
  `)

  useEffect(() => {
    trackPageView({
      documentTitle: 'Schüler Gruppe'
    })
    searchRecommendationsQuery({ variables: {} })
    searchAllSubcoursesQuery({ variables: {} })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const courses: LFSubCourse[] = useMemo(() => {
    let arr
    switch (activeTab) {
      case 0:
      default:
        arr = data?.me?.pupil?.subcoursesJoined || []
        break
      case 1:
        arr = recommendationsData?.subcoursesPublic || []
        break
      case 2:
        arr = allSubcoursesData?.subcoursesPublic || []
        break
    }
    return arr
  }, [
    activeTab,
    allSubcoursesData,
    data?.me?.pupil?.subcoursesJoined,
    recommendationsData
  ])

  const activeCourses: LFSubCourse[] = useMemo(
    () =>
      courses.filter((course: LFSubCourse) => {
        let ok = false
        for (const lecture of course.lectures) {
          const date = DateTime.fromISO(lecture.start).toMillis()
          const now = DateTime.now().toMillis()
          if (date > now) {
            ok = true
          }
        }
        return ok
      }),
    [courses]
  )

  const getLecture: (lectures: LFLecture[]) => LFLecture | null = useCallback(
    (lectures: LFLecture[]) => {
      const lec =
        (lectures?.length && getFirstLectureFromSubcourse(lectures, true)) ||
        null
      return lec
    },
    []
  )

  const getDateString: (lectures: LFLecture[]) => string | undefined =
    useCallback(
      (lectures: LFLecture[]) => {
        const lec = getLecture(lectures)
        if (lec) {
          return lec.start
        }
      },
      [getLecture]
    )

  const searchResults: LFSubCourse[] = useMemo(() => {
    if (lastSearch.length === 0) return activeCourses
    return (
      (lastSearch.length > 0 && activeTab !== 0 && activeCourses) ||
      activeCourses?.filter((sub: LFSubCourse) =>
        sub.course.name.toLowerCase().includes(lastSearch.toLowerCase())
      ) ||
      []
    )
  }, [lastSearch, activeTab, activeCourses])

  const sortedSearchResults: LFSubCourse[] = useMemo(() => {
    return searchResults
  }, [searchResults])

  const search = useCallback(async () => {
    switch (activeTab) {
      case 0:
      default:
        break
      case 1:
        searchRecommendationsQuery({ variables: { name: lastSearch } })
        break
      case 2:
        searchAllSubcoursesQuery({ variables: { name: lastSearch } })
        break
    }
  }, [
    activeTab,
    lastSearch,
    searchAllSubcoursesQuery,
    searchRecommendationsQuery
  ])

  if (loading) return <CenterLoadingSpinner />

  const SubcoursesTab: React.FC = () => {
    const { space } = useTheme()
    return (
      <>
        {/* <Text marginBottom={space['1.5']}>
          {t('matching.group.pupil.tabs.tab1.content')}
        </Text> */}
      </>
    )
  }

  const RecommendationsTab: React.FC = () => {
    return (
      <>
        {/* <Text marginBottom={space['1.5']}>
          {t('matching.group.pupil.tabs.tab2.content')}
        </Text> */}
      </>
    )
  }

  const AllSubcoursesTab: React.FC = () => {
    return (
      <>
        {/* <Text marginBottom={space['1.5']}>
          {t('matching.group.pupil.tabs.tab3.content')}
        </Text> */}
      </>
    )
  }

  return (
    <AsNavigationItem path="group">
      <WithNavigation
        headerContent={<Hello />}
        headerTitle={t('matching.group.pupil.header')}
        headerLeft={<NotificationAlert />}>
        <VStack
          paddingX={space['1']}
          marginX="auto"
          width="100%"
          maxWidth={ContainerWidth}>
          <VStack space={space['1']}>
            <VStack space={space['0.5']} maxWidth={ContentContainerWidth}>
              <Heading>{t('matching.group.pupil.title')}</Heading>
              <Text marginBottom={space['0.5']}>
                {t('matching.group.pupil.content')}
              </Text>
            </VStack>

            <VStack maxWidth={ContentContainerWidth} marginBottom={space['1']}>
              <SearchBar
                value={lastSearch}
                onChangeText={text => setLastSearch(text)}
                onSearch={s => {
                  search()
                }}
              />
            </VStack>

            <Tabs
              onPressTab={(tab: Tab, index: number) => {
                setLastSearch('')
                setActiveTab(index)
              }}
              tabs={[
                {
                  title: t('matching.group.pupil.tabs.tab1.title'),
                  content: <SubcoursesTab />
                },
                // {
                //   title: t('matching.group.pupil.tabs.tab2.title'),
                //   content: <RecommendationsTab />
                // },
                {
                  title: t('matching.group.pupil.tabs.tab3.title'),
                  content: <AllSubcoursesTab />
                }
              ]}
            />
            <CSSWrapper className="course-list__wrapper">
              {(!recommendationsSearchLoading &&
                !allSubcoursesSearchLoading && (
                  <>
                    {(sortedSearchResults?.length &&
                      sortedSearchResults.map(
                        (course: LFSubCourse, index: number) => (
                          <CSSWrapper
                            className="course-list__item"
                            key={`subcourse-${index}`}>
                            <AppointmentCard
                              isSpaceMarginBottom={false}
                              variant="horizontal"
                              description={course.course.outline}
                              tags={course.course.tags}
                              date={getDateString(course.lectures)}
                              countCourse={course.lectures?.length}
                              onPressToCourse={() =>
                                navigate('/single-course', {
                                  state: { course: course.id }
                                })
                              }
                              image={course.course.image}
                              title={course.course.name}
                            />
                          </CSSWrapper>
                        )
                      )) || (
                      <Box paddingLeft={space['1']}>
                        <AlertMessage
                          content="Es wurden keine Kurse gefunden. Bitte passe deine
                          Suche an."
                        />
                      </Box>
                    )}
                  </>
                )) || <CenterLoadingSpinner />}
            </CSSWrapper>
          </VStack>
        </VStack>
      </WithNavigation>
    </AsNavigationItem>
  )
}
export default PupilGroup
