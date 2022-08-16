import {
  View,
  CheckCircleIcon,
  Row,
  Container,
  Text,
  Button,
  Heading,
  HStack,
  useTheme,
  Avatar,
  VStack
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

type Props = {}

const Dashboard: React.FC<Props> = () => {
  const { space } = useTheme()
  const futureDate = useMemo(() => new Date(Date.now() + 360000 * 24 * 7), [])

  return (
    <VStack>
      <HeaderCard>
        <HStack space={space['1']} alignItems="center">
          <ProfilAvatar
            size="md"
            image="https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
          />
          <Heading color={'#fff'}>Hallo Milan!</Heading>
        </HStack>
      </HeaderCard>
      <VStack space={space['1']} marginTop={space['1']}>
        <VStack space={space['0.5']} paddingX={space['1']}>
          <Heading>Nächster Termin</Heading>
          <AppointmentCard
            tags={['Mathematik', 'Gruppenkurs']}
            date={new Date()}
            title="Mathe Grundlagen Klasse 6"
            description="In diesem Kurs gehen wir die Schritte einer Kurvendiskussion von Nullstellen über Extrema bis hin zu Wendepunkten durch."
          />
        </VStack>
        <HSection title="Meine Termine" showAll={true}>
          {Array(2)
            .fill(0)
            .map((el, i) => (
              <AppointmentCard
                description="Lorem Ipsum"
                tags={['Mathematik', 'Gruppenkurs']}
                date={futureDate}
                title="Mathematik Grundlagen Klasse 6"
              />
            ))}
        </HSection>
        <VStack space={space['0.5']} paddingX={space['1']}>
          <Heading>Hausaufgabenhilfe</Heading>
          <AppointmentCard
            tags={['Mathematik', 'Gruppenkurs']}
            date={new Date()}
            title="Mathe Grundlagen Klasse 6"
            description="In diesem Kurs gehen wir die Schritte einer Kurvendiskussion von Nullstellen über Extrema bis hin zu Wendepunkten durch."
          />
        </VStack>
        <VStack space={space['0.5']} paddingX={space['1']}>
          <Heading>Dein:e Lernpartner:in</Heading>
          <AppointmentCard
            tags={['Mathematik', 'Gruppenkurs']}
            date={new Date()}
            title="Mathe Grundlagen Klasse 6"
            description="In diesem Kurs gehen wir die Schritte einer Kurvendiskussion von Nullstellen über Extrema bis hin zu Wendepunkten durch."
          />
        </VStack>
        <HSection title="Vorschläge für dich" showAll={true}>
          {Array(2)
            .fill(0)
            .map((el, i) => (
              <SignInCard
                tags={['Mathematik', 'Gruppenkurs']}
                date={new Date()}
                numAppointments={5}
                title="Flächeninhalt berechnen"
                onClickSignIn={() => null}
              />
            ))}
        </HSection>
        <VStack space={space['0.5']} paddingX={space['1']}>
          <Heading>Angebote</Heading>
          <AppointmentCard
            tags={['Mathematik', 'Gruppenkurs']}
            date={new Date()}
            title="Mathe Grundlagen Klasse 6"
            description="In diesem Kurs gehen wir die Schritte einer Kurvendiskussion von Nullstellen über Extrema bis hin zu Wendepunkten durch."
          />
        </VStack>
      </VStack>
    </VStack>
  )
}
export default Dashboard
