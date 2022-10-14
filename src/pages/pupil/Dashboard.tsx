import {
  Text,
  Button,
  Heading,
  HStack,
  useTheme,
  VStack,
  CheckCircleIcon
} from 'native-base'
import { useMemo, useState } from 'react'
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
import { LFSubCourse } from '../../types/lernfair/Course'
import CTACard from '../../widgets/CTACard'
import BooksIcon from '../assets/icons/lernfair/lf-books.svg'
import { LFMatch } from '../../types/lernfair/Match'

type Props = {}

const Dashboard: React.FC<Props> = () => {
  const { data, error, loading } = useQuery(gql`
    query {
      me {
        firstname
        pupil {
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
            lectures {
              start
            }
            course {
              name
            }
          }
        }
      }

      subcoursesPublic(take: 10, skip: 2) {
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
  `)

  const { space } = useTheme()
  const futureDate = useMemo(() => new Date(Date.now() + 360000 * 24 * 7), [])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [isMatchRequested, setIsMatchRequested] = useState<boolean>()

  if (loading) return <></>

  return (
    <WithNavigation
      headerContent={
        <HStack
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
      <VStack paddingX={space['1']}>
        <VStack space={space['1']} marginTop={space['1']}>
          <VStack space={space['0.5']}>
            <Heading marginY={space['1']}>
              {t('dashboard.appointmentcard.header')}
            </Heading>
            <AppointmentCard
              // TODO
              // onPress={() =>
              //   navigate('/single-course', { state: { course: null } })
              // }
              tags={[]}
              date={new Date()}
              isTeaser={true}
              image="https://images.unsplash.com/photo-1632571401005-458e9d244591?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1742&q=80"
              title="Mathe Grundlagen Klasse 6"
              description="In diesem Kurs gehen wir die Schritte einer Kurvendiskussion von Nullstellen über Extrema bis hin zu Wendepunkten durch."
            />
          </VStack>
          <HSection title={t('dashboard.myappointments.header')} showAll>
            {(data?.me?.pupil?.subcoursesJoined?.length &&
              data?.me?.pupil?.subcoursesJoined?.map(
                (el: LFSubCourse, i: number) => (
                  <AppointmentCard
                    onPressToCourse={() =>
                      navigate('/single-course', { state: { course: el.id } })
                    }
                    key={`appointment-${i}`}
                    description="Lorem Ipsum"
                    tags={el.tags}
                    date={futureDate}
                    image="https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                    title={el?.name}
                  />
                )
              )) || (
              <VStack space={space['0.5']}>
                <Text>Du bist für keine Kurse eingetragen.</Text>
                <Button>Zur Kursübersicht</Button>
              </VStack>
            )}
          </HSection>
          {/* <VStack space={space['0.5']}>
            <Heading marginY={space['1']}>
              {t('dashboard.homework.header')}
            </Heading>
            <CTACard
              title={t('dashboard.homework.title')}
              closeable={false}
              content={<Text>{t('dashboard.homework.content')}</Text>}
              button={<Button variant="outline">{t('openchat')}</Button>}
              icon={<BooksIcon />}
            />
          </VStack> */}
          <HSection showAll title={t('dashboard.learningpartner.header')}>
            {data?.me?.pupil?.matches?.map((match: LFMatch) => (
              <TeacherCard
                name={`${match.student?.firstname} ${match.student?.lastname}`}
                variant="dark"
                tags={match.subjectsFormatted?.map(s => s.name)}
                avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                button={
                  <Button variant="outlinelight">
                    {t('dashboard.offers.match')}
                  </Button>
                }
              />
            )) || (
              <VStack space={space['0.5']}>
                <Text>{t('dashboard.offers.noMatching')}</Text>
                {data?.me?.pupil?.canRequestMatch?.allowed && (
                  <Button onPress={() => navigate('/matching')}>
                    {t('dashboard.offers.requestMatching')}
                  </Button>
                )}
              </VStack>
            )}
          </HSection>
          {/* <VStack space={space['0.5']}>
            <Heading marginY={space['1']}>
              {t('dashboard.learningpartner.header')}
            </Heading>
            <TeacherCard
              name="Max Mustermann"
              variant="dark"
              tags={['Mathematik', 'Gruppenkurs']}
              avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
              button={
                <Button variant="outlinelight">
                  {t('dashboard.offers.match')}
                </Button>
              }
            />
          </VStack> */}
          <HSection title={t('dashboard.relatedcontent.header')} showAll={true}>
            {(data?.subcoursesPublic?.length &&
              data?.subcoursesPublic?.map((sc: LFSubCourse, i: number) => (
                <SignInCard
                  tags={sc.course.tags}
                  data={sc}
                  onClickSignIn={() => null}
                  onPress={() =>
                    navigate('/single-course', { state: { course: sc.id } })
                  }
                />
              ))) || <Text>Es wurden keine Vorschläge für dich gefunden.</Text>}
          </HSection>
          {/* <TwoColGrid title={t('dashboard.offers.header')}>
            {Array(2)
              .fill(0)
              .map((el, i) => (
                <ServiceOfferCard
                  key={`service-offer-${i}`}
                  title="Gruppen-Lernunterstützung"
                  image="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
                />
              ))}
          </TwoColGrid> */}
        </VStack>
      </VStack>
    </WithNavigation>
  )
}
export default Dashboard
