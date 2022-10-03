import { Text, Button, Heading, HStack, useTheme, VStack } from 'native-base'
import { useMemo } from 'react'
import AppointmentCard from '../../widgets/AppointmentCard'
import HSection from '../../widgets/HSection'
import CTACard from '../../widgets/CTACard'
import ProfilAvatar from '../../widgets/ProfilAvatar'
import WithNavigation from '../../components/WithNavigation'
import { useNavigate } from 'react-router-dom'
import NotificationAlert from '../../components/NotificationAlert'
import { useTranslation } from 'react-i18next'
import { gql, useQuery } from '@apollo/client'
import BooksIcon from '../assets/icons/lernfair/lf-books.svg'
import PartyIcon from '../assets/icons/lernfair/lf-pary-small.svg'
import HelperWizard from '../../widgets/HelperWizard'
import LearningPartner from '../../widgets/LearningPartner'

type Props = {}

const DashboardHelper: React.FC<Props> = () => {
  const { data, error, loading } = useQuery(gql`
    query {
      me {
        firstname
        student {
          openMatchRequestCount
          canRequestMatch {
            allowed
            reason
            limit
          }
        }
      }

      subcoursesPublic(take: 10, skip: 2) {
        course {
          name
          description
          outline
        }
      }
    }
  `)

  const { space } = useTheme()
  const futureDate = useMemo(() => new Date(Date.now() + 360000 * 24 * 7), [])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigate = useNavigate()
  const { t } = useTranslation()

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
          <VStack paddingY={space['1']}>
            <HelperWizard index={0} />
          </VStack>
          <VStack space={space['0.5']}>
            <Heading marginY={space['1']}>
              {t('dashboard.appointmentcard.header')}
            </Heading>
            <AppointmentCard
              href={'/single-course'}
              tags={[t('lernfair.subjects.mathe'), 'Gruppenkurs']}
              date={new Date()}
              isTeaser={true}
              image="https://images.unsplash.com/photo-1632571401005-458e9d244591?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1742&q=80"
              title="Mathe Grundlagen Klasse 6"
              description="In diesem Kurs gehen wir die Schritte einer Kurvendiskussion von Nullstellen über Extrema bis hin zu Wendepunkten durch."
            />
          </VStack>
          <HSection title={t('dashboard.myappointments.header')} showAll={true}>
            {data?.me?.pupil?.subcoursesJoined.map((el: any, i: number) => (
              <AppointmentCard
                key={`appointment-${i}`}
                description="Lorem Ipsum"
                tags={['Mathematik', 'Gruppenkurs']}
                date={futureDate}
                image="https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                title={el?.course?.name}
              />
            ))}
          </HSection>
          <HSection
            title={t('dashboard.helpers.headlines.course')}
            showAll={true}
            scrollable={false}
            wrap={true}>
            {new Array(2).fill(0).map(({}, index) => (
              <AppointmentCard
                key={index}
                variant="horizontal"
                description="Lorem Ipsum"
                tags={['Mathematik', 'Gruppenkurs']}
                date={new Date()}
                countCourse={4}
                onPressToCourse={() => alert('YES')}
                image="https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                title="Diskussionen in Mathe!? – Die Kurvendiskussion"
              />
            ))}
            {(data?.student?.canRequestMatch?.allowed && (
              <Button marginY={space['1']}>
                {t('dashboard.helpers.buttons.course')}
              </Button>
            )) || <Text>{data?.student?.canRequestMatch?.reason}</Text>}
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

            {new Array(2).fill(0).map(({}, index) => (
              <LearningPartner
                key={index}
                isDark={true}
                name="Nele"
                subjects={['Englisch']}
                schooltype="Grundschule"
                schoolclass={4}
                avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                button={
                  <Button variant="outlinelight">
                    {t('dashboard.helpers.buttons.solveMatch')}
                  </Button>
                }
              />
            ))}
            <Button marginY={space['1']}>
              {t('dashboard.helpers.buttons.requestMatch')}
            </Button>
          </VStack>
          <VStack space={space['0.5']} marginBottom={space['1.5']}>
            <Heading marginY={space['1']}>
              {t('dashboard.helpers.headlines.recommend')}
            </Heading>
            <CTACard
              title={t('dashboard.helpers.headlines.recommendFriends')}
              closeable={false}
              content={
                <Text>{t('dashboard.helpers.contents.recommendFriends')}</Text>
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
  )
}
export default DashboardHelper
