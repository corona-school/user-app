import {
  View,
  CheckCircleIcon,
  InfoIcon,
  Row,
  Container,
  Text,
  Button,
  Heading,
  HStack,
  useTheme,
  Avatar,
  VStack,
  Badge,
  Box,
  HamburgerIcon,
  DeleteIcon,
  CircleIcon
} from 'native-base'
import { useMemo } from 'react'
import AppointmentCard from '../widgets/AppointmentCard'
import ServiceOfferCard from '../widgets/ServiceOfferCard'
import HSection from '../widgets/HSection'
import SignInCard from '../widgets/SignInCard'
import TwoColGrid from '../widgets/TwoColGrid'
import PersonListing from '../widgets/PersonListing'
import PostCards from '../widgets/PostCards'
import CTACard from '../widgets/CTACard'
import LearningPartner from '../widgets/LearningPartner'
import RatingCard from '../widgets/RatingCard'
import InstructionProgress from '../widgets/InstructionProgress'
import Downloads from '../components/Downloads'
import HeaderCard from '../components/HeaderCard'
import ProfilAvatar from '../widgets/ProfilAvatar'
import TeacherCard from '../widgets/TeacherCard'
import WithNavigation from '../components/WithNavigation'
import { TouchableOpacity } from 'react-native'
import { Navigate, useNavigate } from 'react-router-dom'
import SettingsButton from '../components/SettingsButton'
import NotificationAlert from '../components/NotificationAlert'

type Props = {}

const Dashboard: React.FC<Props> = () => {
  const { space } = useTheme()
  const futureDate = useMemo(() => new Date(Date.now() + 360000 * 24 * 7), [])
  const navigate = useNavigate()

  return (
    <WithNavigation
      headerContent={
        <HStack space={space['1']} alignItems="center">
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
              image="https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
              title="Mathe Grundlagen Klasse 6"
              description="In diesem Kurs gehen wir die Schritte einer Kurvendiskussion von Nullstellen über Extrema bis hin zu Wendepunkten durch."
            />
          </VStack>
          <HSection title="Meine Termine" showAll={true}>
            {Array(4)
              .fill(0)
              .map((el, i) => (
                <AppointmentCard
                  description="Lorem Ipsum"
                  tags={['Mathematik', 'Gruppenkurs']}
                  date={futureDate}
                  image="https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                  title="Diskussionen in Mathe!? – Die Kurvendiskussion"
                />
              ))}
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
            {Array(4)
              .fill(0)
              .map((el, i) => (
                <SignInCard
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
              ))}
          </HSection>
          <TwoColGrid title="Angebote">
            {Array(2)
              .fill(0)
              .map((el, i) => (
                <ServiceOfferCard
                  title="Gruppen-Lernunterstützung"
                  image="https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                />
              ))}
          </TwoColGrid>
        </VStack>
      </VStack>
    </WithNavigation>
  )
}
export default Dashboard
