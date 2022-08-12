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

type Props = {}

const Dashboard: React.FC<Props> = () => {
  const { space } = useTheme()
  return (
    <VStack>
      <HeaderCard>
        <HStack space={space['1']} alignItems="center">
          <Avatar size="md" />
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
                date={new Date()}
                title="Mathematik Grundlagen Klasse 6"
              />
            ))}
        </HSection>
      </VStack>
    </VStack>
  )
}
export default Dashboard
