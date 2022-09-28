import { View, Text, Heading, Row, useTheme, Button, Box } from 'native-base'
import Card from '../components/Card'
import InstructionProgress from './InstructionProgress'

type Props = {
  index?: number
}

const HelperWizard: React.FC<Props> = ({ index }) => {
  const { space } = useTheme()

  return (
    <View>
      <Card variant="dark" flexibleWidth>
        <Row padding="30px" flexDirection="column">
          <Heading fontSize="lg" color="lightText" marginBottom="17px">
            Die nächsten Schritte
          </Heading>

          <InstructionProgress
            currentIndex={index}
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
                    text: (
                      <>
                        <Box flexDirection="row" marginBottom={space['0.5']}>
                          <Text marginRight="5px">Einreichen bis:</Text>
                          <Text bold color="primary.400">
                            tt.mm.jjjj
                          </Text>
                        </Box>
                        <Box>
                          <Text marginBottom={space['1']}>
                            Denke dran, dein Führungszeugnis einzureichen, damit
                            du weiterhin bei uns mitmachen kannst. Hierfür hast
                            du 2 Monate nach Registrierung Zeit.
                          </Text>
                          <Button>Vorduck herunterladen</Button>
                        </Box>
                      </>
                    )
                  }
                ]
              },
              {
                label: 'Angebot',
                title: '',
                content: [
                  {
                    title: 'Angebot erstellen',
                    text: (
                      <>
                        <Box>
                          <Text marginBottom={space['1']}>
                            Lorem ipsum dolor sit amet, consetetur sadipscing
                            elitr, sed diam nonumy eirmod tempor invidunt ut
                            labore et dolore magna aliquyam erat.
                          </Text>
                          <Button>Angebot erstellen</Button>
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
                    title: 'Führungszeugnis hochladen',
                    text: (
                      <>
                        <Box>
                          <Text marginBottom={space['1']}>
                            Lorem ipsum dolor sit amet, consetetur sadipscing
                            elitr, sed diam nonumy eirmod tempor invidunt ut
                            labore et dolore magna aliquyam erat.
                          </Text>
                          <Button>Hochladen</Button>
                        </Box>
                      </>
                    )
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
