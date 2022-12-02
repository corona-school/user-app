import { gql, useQuery } from '@apollo/client'
import { useMatomo } from '@jonkoops/matomo-tracker-react'
import { View, Text, VStack, useTheme, Heading } from 'native-base'
import { useEffect } from 'react'
import NotificationAlert from '../components/notifications/NotificationAlert'
import SettingsButton from '../components/SettingsButton'
import WithNavigation from '../components/WithNavigation'
import { LFSubCourse } from '../types/lernfair/Course'
import SignInCard from '../widgets/SignInCard'

type Props = {}

const Explore: React.FC<Props> = () => {
  const { data, error, loading } = useQuery(gql`
    query {
      subcoursesPublic(take: 10, skip: 0) {
        course {
          name
          description
          outline
        }
      }
    }
  `)

  const { space } = useTheme()
  const { trackPageView } = useMatomo()

  useEffect(() => {
    trackPageView({
      documentTitle: 'Erkunden'
    })
  }, [])

  if (loading) return <></>
  return (
    <WithNavigation headerContent={<></>} headerLeft={<NotificationAlert />}>
      <Heading padding={space['1']}>Erkunden</Heading>

      <VStack space={space['1']} padding={space['1']}>
        {data.subcoursesPublic.map((sc: LFSubCourse) => (
          <SignInCard
            data={sc}
            flexibleWidth
            // image="https://images.unsplash.com/photo-1560785477-d43d2b34e0df?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80"
            // tags={['Mathematik', 'Gruppenkurs']}
            // date={new Date()}
            // numAppointments={5}
            // title={name}
            onClickSignIn={() => null}
          />
        )) || <Text>Es wurden keine Kurse gefunden.</Text>}
      </VStack>
    </WithNavigation>
  )
}
export default Explore
