import {
  Text,
  Heading,
  useTheme,
  VStack,
  Button,
  useBreakpointValue,
  Flex,
  Column
} from 'native-base'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import WithNavigation from '../../components/WithNavigation'
import NotificationAlert from '../../components/NotificationAlert'
import AppointmentCard from '../../widgets/AppointmentCard'
import Tabs from '../../components/Tabs'
import HSection from '../../widgets/HSection'
import { useEffect, useMemo } from 'react'
import { gql, useQuery } from '@apollo/client'
import { LFCourse, LFSubCourse } from '../../types/lernfair/Course'
import Utility from '../../Utility'
import { useMatomo } from '@jonkoops/matomo-tracker-react'

type Props = {}

const query = gql`
  query {
    me {
      student {
        canCreateCourse {
          allowed
          reason
        }
        coursesInstructing {
          id
          name
          description
          outline
          tags {
            name
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
  }
`

const StudentGroup: React.FC<Props> = () => {
  const { data, loading } = useQuery(query)
  const { space, sizes } = useTheme()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const ContainerWidth = useBreakpointValue({
    base: '100%',
    lg: sizes['containerWidth']
  })

  const ButtonContainer = useBreakpointValue({
    base: '100%',
    lg: sizes['desktopbuttonWidth']
  })

  const CardGrid = useBreakpointValue({
    base: '100%',
    lg: '47%'
  })

  const publishedSubcourses: LFSubCourse[] = useMemo(
    () =>
      data?.me?.student?.subcoursesInstructing.filter(
        (sub: LFSubCourse) => sub.published
      ),
    [data?.me?.student?.subcoursesInstructing]
  )

  const submittedSubcourses: LFSubCourse[] = useMemo(
    () =>
      data?.me?.student?.subcoursesInstructing.filter(
        (sub: LFSubCourse) => !sub.published
      ),
    [data?.me?.student?.subcoursesInstructing]
  )

  const draftedCourses: LFCourse[] = useMemo(
    () => data?.me?.student?.coursesInstructing,
    [data?.me?.student?.coursesInstructing]
  )

  const { trackPageView, trackEvent } = useMatomo()

  useEffect(() => {
    trackPageView({
      documentTitle: 'Helfer Gruppe'
    })
  }, [])

  if (loading) return <></>

  return (
    <WithNavigation
      headerTitle={t('matching.group.helper.header')}
      headerLeft={<NotificationAlert />}>
      <VStack paddingX={space['1']} width={ContainerWidth}>
        <VStack space={space['1']}>
          <VStack space={space['0.5']}>
            <Heading>{t('matching.group.helper.title')}</Heading>
            <Text>{t('matching.group.helper.content')}</Text>
          </VStack>
          <VStack>
            <Heading fontSize="sm" marginBottom="5px">
              {t('matching.group.helper.contentHeadline')}
            </Heading>
            <Text>{t('matching.group.helper.contentHeadlineContent')}</Text>
          </VStack>
          <VStack paddingY={space['1']}>
            <Button
              width={ButtonContainer}
              onPress={() => {
                trackEvent({
                  category: 'matching',
                  action: 'click-event',
                  name: 'Helfer Matching Gruppen – Kurs erstellen',
                  documentTitle:
                    'Matching Gruppen Lernunterstützung Kurs erstellen'
                })
                navigate('/create-course')
              }}>
              {t('matching.group.helper.button')}
            </Button>
          </VStack>
          {/* <HSection
            title={t('dashboard.helpers.headlines.course')}
            showAll={false}>
            {new Array(5).fill(0).map(({}, index) => (
              <AppointmentCard
                key={index}
                description="Lorem Ipsum"
                date={futureDate.toString()}
                tags={[{ name: 'Mathematik' }, { name: 'Gruppenkurs' }]}
                image="https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                title="Diskussionen in Mathe!? – Die Kurvendiskussion"
              />
            ))}
          </HSection> */}
          <VStack>
            <Heading marginBottom={space['1.5']}>
              {t('matching.group.helper.course.title')}
            </Heading>
            <Tabs
              tabs={[
                {
                  title: t('matching.group.helper.course.tabs.tab1.title'),
                  content: (
                    <>
                      <Flex direction="row" flexWrap="wrap">
                        {publishedSubcourses?.map(
                          (sub: LFSubCourse, index: number) => {
                            const firstLecture =
                              Utility.getFirstLectureFromSubcourse(sub.lectures)

                            return (
                              <Column width={CardGrid} marginRight="15px">
                                <AppointmentCard
                                  key={index}
                                  variant="horizontal"
                                  description={sub.outline}
                                  tags={sub.course.tags}
                                  date={firstLecture?.start || ''}
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
                    </>
                  )
                },
                {
                  title: t('matching.group.helper.course.tabs.tab2.title'),
                  content: (
                    <>
                      <Flex direction="row" flexWrap="wrap">
                        {submittedSubcourses?.map(
                          (sub: LFSubCourse, index: number) => {
                            const firstLecture =
                              Utility.getFirstLectureFromSubcourse(sub.lectures)

                            return (
                              <Column width={CardGrid} marginRight="15px">
                                <AppointmentCard
                                  key={index}
                                  variant="horizontal"
                                  description={sub.outline}
                                  tags={sub.course.tags}
                                  date={firstLecture?.start || ''}
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
                    </>
                  )
                },
                {
                  title: t('matching.group.helper.course.tabs.tab3.title'),
                  content: (
                    <>
                      <Flex direction="row" flexWrap="wrap">
                        {draftedCourses?.map(
                          (course: LFCourse, index: number) => {
                            return (
                              <Column width={CardGrid} marginRight="15px">
                                <AppointmentCard
                                  key={index}
                                  variant="horizontal"
                                  description={course.outline}
                                  tags={course.tags}
                                  image={course.image}
                                  title={course.name}
                                  onPressToCourse={() =>
                                    navigate('/single-course', {
                                      state: { course: course.id }
                                    })
                                  }
                                />
                              </Column>
                            )
                          }
                        )}
                      </Flex>
                    </>
                  )
                },
                {
                  title: t('matching.group.helper.course.tabs.tab4.title'),
                  content: (
                    <>
                      <Flex direction="row" flexWrap="wrap">
                        {new Array(3).fill(0).map(
                          (course: LFCourse, index) =>
                            !!course && (
                              <Column width={CardGrid} marginRight="15px">
                                <AppointmentCard
                                  key={index}
                                  variant="horizontal"
                                  description={course.outline}
                                  tags={course.tags}
                                  image={course.image}
                                  title={course.name}
                                  onPressToCourse={() =>
                                    navigate('/single-course', {
                                      state: { course: course.id }
                                    })
                                  }
                                />
                              </Column>
                            )
                        )}
                      </Flex>
                    </>
                  )
                }
              ]}
            />
          </VStack>
          <VStack>
            <HSection
              onShowAll={() => navigate('/group/offer')}
              title={t('matching.group.helper.offers.title')}
              showAll={true}>
              {new Array(5).fill(0).map(
                (course: LFCourse, index) =>
                  !!course && (
                    <AppointmentCard
                      key={index}
                      variant="horizontal"
                      description={course.outline}
                      tags={course.tags}
                      image={course.image}
                      title={course.name}
                      onPressToCourse={() =>
                        navigate('/single-course', {
                          state: { course: course.id }
                        })
                      }
                    />
                  )
              )}
            </HSection>
          </VStack>
        </VStack>
      </VStack>
    </WithNavigation>
  )
}
export default StudentGroup
