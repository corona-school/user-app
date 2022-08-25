import { Box, Heading, useTheme, Text } from 'native-base'
import BackButton from '../components/BackButton'
import NotificationAlert from '../components/NotificationAlert'
import WithNavigation from '../components/WithNavigation'
import WebServiceCard from '../widgets/WebServiceCard'

type Props = {}

const DigitaleTools: React.FC<Props> = () => {
  const { space } = useTheme()

  return (
    <WithNavigation
      headerTitle="Quickstart"
      headerLeft={<BackButton />}
      headerRight={<NotificationAlert />}>
      <Box paddingTop={space['4']} paddingX={space['1.5']}>
        <Heading paddingBottom={1.5}>Digitale Tools</Heading>
        <Text paddingBottom={space['1']}>
          Hier findest du eine Liste mit digitalen Tools, die du kostenlos für
          eine spannende und abwechslungsreiche Unterrichtsgestaltung nutzen
          kannst.
        </Text>
      </Box>
      <Box paddingX={space['1.5']} paddingY={space['1']}>
        <WebServiceCard
          title="Canva"
          description="Canva ist ein kostenloses Design-Tool, mit dem schnell und einfach schöne Arbeitsblätter und Präsentationen erstellt werden können. Hierbei kann aus einer Fülle an Vorlagen ausgewählt werden und diese an die eigenen Bedürfnissen angepasst werden."
          image="https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
          url="https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
          tags={['Hallo', 'Test']}
          pros={['Hallo', 'Test']}
          contra={['Hallo', 'Test']}
        />
      </Box>
      <Box paddingX={space['1.5']} paddingY={space['1']}>
        <WebServiceCard
          title="Canva"
          description="Canva ist ein kostenloses Design-Tool, mit dem schnell und einfach schöne Arbeitsblätter und Präsentationen erstellt werden können. Hierbei kann aus einer Fülle an Vorlagen ausgewählt werden und diese an die eigenen Bedürfnissen angepasst werden."
          image="https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
          url="https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
          tags={['Hallo', 'Test']}
          pros={['Hallo', 'Test']}
          contra={['Hallo', 'Test']}
        />
      </Box>
      <Box paddingX={space['1.5']} paddingY={space['1']}>
        <WebServiceCard
          title="Canva"
          description="Canva ist ein kostenloses Design-Tool, mit dem schnell und einfach schöne Arbeitsblätter und Präsentationen erstellt werden können. Hierbei kann aus einer Fülle an Vorlagen ausgewählt werden und diese an die eigenen Bedürfnissen angepasst werden."
          image="https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
          url="https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
          tags={['Hallo', 'Test']}
          pros={['Hallo', 'Test']}
          contra={['Hallo', 'Test']}
        />
      </Box>
    </WithNavigation>
  )
}
export default DigitaleTools
