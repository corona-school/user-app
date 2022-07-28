import { View, CheckCircleIcon } from 'native-base'
import AppointmentCard from '../widgets/AppointmentCard'
import ServiceOfferCard from '../widgets/ServiceOfferCard'
import HSection from '../widgets/HSection'
import SignInCard from '../widgets/SignInCard'
import TwoColGrid from '../widgets/TwoColGrid'
import StudentMatch from '../widgets/StudentMatch'
import PersonListing from '../widgets/PersonListing'
import PostCards from '../widgets/PostCards'

export default function Dashboard() {
  return (
    <View>
      <StudentMatch />
      <HSection title="Deine Kinder – Variante 1" showAll={false}>
        {Array(10)
          .fill(0)
          .map((el, i) => (
            <PersonListing
              variant="normal"
              username="Milan"
              avatar="https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
              onPressLink={() => null}
              avatarsize="md"
              usernamesize="md"
              usernameweight="700"
            />
          ))}
      </HSection>
      <HSection title="Deine Kinder – Variante 2" showAll={false}>
        {Array(10)
          .fill(0)
          .map((el, i) => (
            <PersonListing
              variant="card"
              username="Milan"
              avatar="https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
              onPressLink={() => null}
              avatarsize="md"
              usernamesize="md"
              usernameweight="700"
            />
          ))}
      </HSection>
      <HSection title="Elternblog" showAll={true}>
        {Array(10)
          .fill(0)
          .map((el, i) => (
            <PostCards
              title="Hausaufgaben leicht gemacht"
              content="Hausaufgaben sind vor allem dazu da, das Gelernte zu vertiefen und anzuwenden."
              link="http://localhost:3000/"
              image="https://www.holidify.com/images/cmsuploads/compressed/Bangalore_citycover_20190613234056.jpg"
            />
          ))}
      </HSection>
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
      <HSection title="Angebote Slider">
        {Array(4)
          .fill(0)
          .map((el, i) => (
            <ServiceOfferCard
              title="Gruppen-Lernunterstützung"
              content="digitales Zuschalten der Helfer:innen 1x wöchentlich über 3-12 Monate"
              icon={<CheckCircleIcon size={10} />}
            />
          ))}
      </HSection>
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
