import { Row, useTheme, View } from 'native-base'
import AppointmentCard from '../widgets/AppointmentCard'
import CourseOfferCard from '../widgets/CourseOfferCard'
import HSection from '../widgets/HSection'
import SignInCard from '../widgets/SignInCard'
import TwoColGrid from '../widgets/TwoColGrid'

export default function Dashboard() {
  return (
    <View>
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
            <CourseOfferCard title="Gruppen-Lernunterstützung" />
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
