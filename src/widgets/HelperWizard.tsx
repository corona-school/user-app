import { View, Text, Heading, Row, useTheme, Button, Box } from 'native-base'
import Card from '../components/Card'
import InstructionProgress from './InstructionProgress'

type Props = {}

const HelperWizard: React.FC<Props> = () => {
  const { space } = useTheme()

  return (
    <View>
      <Card variant="dark" flexibleWidth>
        <Row padding="30px" flexDirection="column">
          <Heading fontSize="lg" color="lightText" marginBottom="17px">
            Die nächsten Schritte
          </Heading>

          <InstructionProgress
            isDark={true}
            instructions={[
              {
                label: 'Kennenlernen',
                title: '',
                content: [
                  {
                    title: 'Wir möchten dich kennenlernen',
                    text: (
                      <>
                        <Box>
                          <Text marginBottom={space['1']}>
                            Bevor du bei uns anfangen kannst möchten wir dich in
                            einem persönlichen Gespräch kennenlernen. Vereinbare
                            einfach einen Termin mit uns.
                          </Text>
                          <Button>Termin vereinbaren</Button>
                        </Box>
                      </>
                    )
                  }
                ]
              },
              {
                label: 'Führungszeugnis',
                title: '',
                content: [
                  {
                    title: 'Führungszeugnis beantragen',
                    text: 'Denke dran, dein Führungszeugnis einzureichen, damit du weiterhin bei uns mitmachen kannst. Hierfür hast du 2 Monate nach Registrierung Zeit.'
                  }
                ]
              },
              {
                label: 'Angebot',
                title: '',
                content: [
                  {
                    title: 'Angebot erstellen',
                    text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.'
                  }
                ]
              },
              {
                label: 'Führungszeugnis',
                title: '',
                content: [
                  {
                    title: 'Führungszeugnis hochladen',
                    text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.'
                  }
                ]
              }
            ]}
          />
        </Row>
      </Card>
    </View>
  )
}
export default HelperWizard
