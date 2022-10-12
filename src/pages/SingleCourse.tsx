import {
  Box,
  Heading,
  useTheme,
  Text,
  Image,
  Column,
  Row,
  Button
} from 'native-base'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import BackButton from '../components/BackButton'
import NotificationAlert from '../components/NotificationAlert'
import Tabs from '../components/Tabs'
import Tag from '../components/Tag'
import WithNavigation from '../components/WithNavigation'
import { LFLecture, LFSubCourse, LFTag } from '../types/lernfair/Course'
import CourseTrafficLamp from '../widgets/CourseTrafficLamp'
import ProfilAvatar from '../widgets/ProfilAvatar'

import Utility from '../Utility'
import { gql, useQuery } from '@apollo/client'

type Props = {}

const SingleCourse: React.FC<Props> = () => {
  const { space } = useTheme()
  const { t } = useTranslation()

  const location = useLocation()
  const { course: courseId } = (location.state || {}) as { course: LFSubCourse }

  const {
    data: courseData,
    loading,
    error
  } = useQuery(gql`query{
    subcourse(subcourseId: ${courseId}){
      id
      participantsCount
      maxParticipants
      canJoin{
        allowed
        reason
        limit
      }
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
  if (loading) return <></>

  return (
    <WithNavigation
      headerTitle={
        course?.course?.name.length > 20
          ? course?.course?.name.substring(0, 20)
          : course?.course?.name
      }
      headerLeft={<BackButton />}>
      <Box paddingX={space['1.5']}>
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
                  {course?.lectures?.map(
                    (lec: LFLecture, i: number) =>
                      (
                        <Row flexDirection="column" marginBottom={space['1.5']}>
                          <Heading paddingBottom={space['0.5']} fontSize="md">
                            {t('single.global.lesson')}{' '}
                            {`${i + 1}`.padStart(2, '0')}
                          </Heading>
                          <Text paddingBottom={space['0.5']}>
                            {Utility.formatDate(lec.start)}{' '}
                            {t('single.global.clock')}
                          </Text>
                          <Text>
                            <Text bold>Dauer: </Text> {lec?.duration / 60}{' '}
                            Stunden
                          </Text>
                        </Row>
                      ) || <Text>Es wurden keine Lektionen eingetragen.</Text>
                  )}
                </>
              )
            }
            // {
            //   title: t('single.tabs.participant'),
            //   content: (
            //     <>
            //       <Row marginBottom={space['1.5']} alignItems="center">
            //         <Column marginRight={space['1']}>
            //           <ProfilAvatar
            //             size="md"
            //             image="https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
            //           />
            //         </Column>
            //         <Column>
            //           <Heading fontSize="md">Linda</Heading>
            //           <Text>
            //             13 {t('single.global.years') + ' '}
            //             {t('single.global.from') + ' '}
            //             Köln
            //           </Text>
            //         </Column>
            //       </Row>
            //       {course?.participants?.map(
            //         (p: any) =>
            //           (
            //             <Row marginBottom={space['1.5']} alignItems="center">
            //               <Column marginRight={space['1']}>
            //                 <ProfilAvatar
            //                   size="md"
            //                   image="https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
            //                 />
            //               </Column>
            //               <Column>
            //                 <Heading fontSize="md">{p.firstname}</Heading>
            //                 <Text>
            //                   {t('single.global.from')} {p.state?.label}
            //                 </Text>
            //               </Column>
            //             </Row>
            //           ) || <Text>Es sind noch keine Teilnehmer vorhanden.</Text>
            //       )}
            //     </>
            //   )
            // }
          ]}
        />

        <Box marginBottom={space['0.5']}>
          {!course?.canJoin?.allowed && <Text>{course?.canJoin?.reason}</Text>}
          <Button
            marginBottom={space['0.5']}
            isDisabled={!course?.canJoin?.allowed}>
            {t('single.button.login')}
          </Button>
        </Box>
        {course?.allowContact && (
          <Box marginBottom={space['1.5']}>
            <Button variant="outline">{t('single.button.contact')}</Button>
          </Box>
        )}
      </Box>
    </WithNavigation>
  )
}
export default SingleCourse
