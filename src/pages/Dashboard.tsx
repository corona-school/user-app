import { Row, useTheme, View, VStack } from 'native-base'
import AppointmentCard from '../widgets/AppointmentCard'
import CourseOfferCard from '../widgets/CourseOfferCard'
import ServiceOfferCard from '../widgets/ServiceOfferCard'
import HSection from '../widgets/HSection'
import SignInCard from '../widgets/SignInCard'
import TwoColGrid from '../widgets/TwoColGrid'
import TeacherCard from '../widgets/TeacherCard'

export default function Dashboard() {
  const { space } = useTheme()

  return (
    <View>
      <VStack space={space['1']}>
        {Array(10)
          .fill(0)
          .map((el, i) => (
            <TeacherCard
              tags={['Mathematik', 'Englisch']}
              name={'Rainer Zufall'}
            />
          ))}
      </VStack>
      <HSection title="Termin" showAll={true}>
        {Array(10)
          .fill(0)
          .map((el, i) => (
            <AppointmentCard
              tags={['Mathematik', 'Gruppenkurs']}
              child="Milan"
              date={new Date()}
              title="Mathematik Grundlagen Klasse 6"
            />
          ))}
      </HSection>
      <TwoColGrid title="Angebote">
        {Array(4)
          .fill(0)
          .map((el, i) => (
            <ServiceOfferCard title="Gruppen-Lernunterstützung" />
          ))}
      </TwoColGrid>
      <HSection title="Neu für Nele" showAll={true}>
        {Array(10)
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
    </View>
  )
}
