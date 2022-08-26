import {
  CheckCircleIcon,
  Text,
  Button,
  Heading,
  HStack,
  useTheme,
  VStack
} from 'native-base'
import { useMemo } from 'react'
import AppointmentCard from '../widgets/AppointmentCard'
import ServiceOfferCard from '../widgets/ServiceOfferCard'
import HSection from '../widgets/HSection'
import SignInCard from '../widgets/SignInCard'
import TwoColGrid from '../widgets/TwoColGrid'
import CTACard from '../widgets/CTACard'
import ProfilAvatar from '../widgets/ProfilAvatar'
import TeacherCard from '../widgets/TeacherCard'
import WithNavigation from '../components/WithNavigation'
import { useNavigate } from 'react-router-dom'
import SettingsButton from '../components/SettingsButton'
import NotificationAlert from '../components/NotificationAlert'

type Props = {}

const Dashboard: React.FC<Props> = () => {
  const { space } = useTheme()
  const futureDate = useMemo(() => new Date(Date.now() + 360000 * 24 * 7), [])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigate = useNavigate()

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
          <Heading color={'#fff'}>Hallo Milan!</Heading>
        </HStack>
      }
      headerRight={<SettingsButton />}
      headerLeft={<NotificationAlert />}>
      <VStack>
        <VStack space={space['1']} marginTop={space['1']}>
          <VStack space={space['0.5']} paddingX={space['1']}>
            <Heading>Nächster Termin</Heading>
            <AppointmentCard
              tags={['Mathematik', 'Gruppenkurs']}
              date={new Date()}
              isTeaser={true}
              image="https://images.unsplash.com/photo-1632571401005-458e9d244591?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1742&q=80"
              title="Mathe Grundlagen Klasse 6"
              description="In diesem Kurs gehen wir die Schritte einer Kurvendiskussion von Nullstellen über Extrema bis hin zu Wendepunkten durch."
            />
          </VStack>
          <HSection title="Meine Termine" showAll={true}>
            {/* {Array(4)
              .fill(0)
              .map((el, i) => (
                <AppointmentCard
                  key={`appointment-${i}`}
                  description="Lorem Ipsum"
                  tags={['Mathematik', 'Gruppenkurs']}
                  date={futureDate}
                  image="https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                  title="Diskussionen in Mathe!? – Die Kurvendiskussion"
                />
              ))} */}

            <AppointmentCard
              description="Lorem Ipsum"
              tags={['Mathematik', 'Gruppenkurs']}
              date={futureDate}
              image="https://images.unsplash.com/photo-1585432959445-662c9bbcd91d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8aG9tZSUyMHNjaG9vbGluZ3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60"
              title="Diskussionen in Mathe!? – Die Kurvendiskussion"
            />

            <AppointmentCard
              description="Lorem Ipsum"
              tags={['Deutsch']}
              date={futureDate}
              image="https://images.unsplash.com/photo-1610484826967-09c5720778c7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8aG9tZSUyMHNjaG9vbGluZ3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60"
              title="Satzarten"
            />

            <AppointmentCard
              description="Lorem Ipsum"
              tags={['Mathematik']}
              date={futureDate}
              image="https://images.unsplash.com/photo-1585432959322-4db03962b004?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzN8fGhvbWUlMjBzY2hvb2xpbmd8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60"
              title="Statistiken auswerten"
            />
          </HSection>
          <VStack space={space['0.5']} paddingX={space['1']}>
            <Heading>Hausaufgabenhilfe</Heading>
            <CTACard
              title="Du brauchst Hife bei deinen Hausaufgaben?"
              closeable={false}
              content={
                <Text>Schreibe uns einfach an, wir helfen dir gerne.</Text>
              }
              button={<Button variant="outline">Chat beginnen</Button>}
              icon={<CheckCircleIcon size="10" />}
            />
          </VStack>
          <VStack space={space['0.5']} paddingX={space['1']}>
            <Heading>Dein:e Lernpartner:in</Heading>
            <TeacherCard
              name="Max Mustermann"
              variant="dark"
              tags={['Mathematik', 'Gruppenkurs']}
              avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
              button={<Button variant="outlinelight">Match auflösen</Button>}
            />
          </VStack>
          <HSection title="Vorschläge für dich" showAll={true}>
            {/* {Array(4)
              .fill(0)
              .map((el, i) => (
                <SignInCard
                  key={`signincard-${i}`}
                  image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                  tags={[
                    'Mathematik',
                    'Gruppenkurs',
                    'Gruppenkurs',
                    'Gruppenkurs'
                  ]}
                  date={new Date()}
                  numAppointments={5}
                  title="Flächeninhalt berechnen"
                  onClickSignIn={() => null}
                />
              ))} */}
            <SignInCard
              image="https://images.unsplash.com/photo-1560785477-d43d2b34e0df?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80"
              tags={['Mathematik', 'Gruppenkurs']}
              date={new Date()}
              numAppointments={5}
              title="Flächeninhalt berechnen"
              onClickSignIn={() => null}
            />
            <SignInCard
              image="https://images.unsplash.com/photo-1522881451255-f59ad836fdfb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8d3JpdGluZ3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60"
              tags={['Deutsch']}
              date={new Date()}
              numAppointments={5}
              title="Rechtschreibung – Grundlagen"
              onClickSignIn={() => null}
            />
            <SignInCard
              image="https://images.unsplash.com/photo-1446329360995-b4642a139973?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjV8fG1hdGhzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60"
              tags={['Mathematik']}
              date={new Date()}
              numAppointments={5}
              title="Satz des Pythagoras – Grundlagen"
              onClickSignIn={() => null}
            />
          </HSection>
          <TwoColGrid title="Angebote">
            {Array(2)
              .fill(0)
              .map((el, i) => (
                <ServiceOfferCard
                  key={`service-offer-${i}`}
                  title="Gruppen-Lernunterstützung"
                  image="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
                />
              ))}
          </TwoColGrid>
        </VStack>
      </VStack>
    </WithNavigation>
  )
}
export default Dashboard
