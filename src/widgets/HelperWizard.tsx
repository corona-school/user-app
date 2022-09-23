import { View, Text, Heading, Row, useTheme, Button } from 'native-base'
import Card from '../components/Card'

type Props = {}

const HelperWizard: React.FC<Props> = () => {
  const { space } = useTheme()

  return (
    <View>
      <Card variant="dark" flexibleWidth>
        <Row padding={space['1']} flexDirection="column">
          <Heading fontSize="lg" color="lightText" marginBottom={space['2']}>
            Die nächsten Schritte
          </Heading>
          <Heading fontSize="md" color="lightText" marginBottom={space['0.5']}>
            Wir möchten dich kennenlernen
          </Heading>
          <Text color="lightText" marginBottom={space['1.5']}>
            Bevor du bei uns anfangen kannst möchten wir dich in einem
            persönlichen Gespräch kennenlernen. Vereinbare einfach einen Termin
            mit uns.
          </Text>
          <Button>Termin vereinbaren</Button>
        </Row>
      </Card>
    </View>
  )
}
export default HelperWizard
