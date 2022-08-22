import {
  Box,
  Heading,
  useTheme,
  ArrowBackIcon,
  Badge,
  DeleteIcon,
  Text,
  Row,
  FormControl,
  Select,
  TextArea,
  Checkbox,
  Link,
  Button
} from 'native-base'
import Accordion from '../components/Accordion'
import Tabs from '../components/Tabs'
import WithNavigation from '../components/WithNavigation'

type Props = {}

const faq = [
  {
    title: 'Mein:e Lernpartner:in meldet sich nicht. Was soll ich tun?',
    text: 'Möchtest du wissen, was unsere Plattform alles zu bieten hat? Wir zeigen dir die wichtigsten Funktionen.'
  },
  {
    title:
      'Wie kann ich die Zusammenarbeit mit einem:r Lernpartner:in beenden?',
    text: ' Möchtest du wissen, was unsere Plattform alles zu bieten hat? Wir zeigen dir die wichtigsten Funktionen.'
  },
  {
    title:
      'Kann ich mich für mehrere Angebote von Lern-Fair gleichzeitig registrieren?',
    text: 'Ja, du kannst dich gerne für mehrere Angebote bei uns registrieren. Beachte dabei, dass manche Angebote spezielle Voraussetzungen fordern, mehr Details findest du auf den jeweiligen Projektseiten auf unserer Website.'
  },
  {
    title: 'Wie oft treffen sich die Lernpaare pro Woche?',
    text: 'Möchtest du wissen, was unsere Plattform alles zu bieten hat? Wir zeigen dir die wichtigsten Funktionen.'
  },
  {
    title:
      'Nach welchen Kriterien werden Schüler:innen und Helfer:innen verbunden?',
    text: 'Möchtest du wissen, was unsere Plattform alles zu bieten hat? Wir zeigen dir die wichtigsten Funktionen.'
  },
  {
    title: 'Mein:e Lernpartner:in meldet sich nicht. Was soll ich tun?',
    text: 'Möchtest du wissen, was unsere Plattform alles zu bieten hat? Wir zeigen dir die wichtigsten Funktionen.'
  },
  {
    title:
      'Wie kann ich die Zusammenarbeit mit einem:r Lernpartner:in beenden?',
    text: 'Möchtest du wissen, was unsere Plattform alles zu bieten hat? Wir zeigen dir die wichtigsten Funktionen.'
  },
  {
    title: 'Wie oft treffen sich die Lernpaare pro Woche?',
    text: 'Möchtest du wissen, was unsere Plattform alles zu bieten hat? Wir zeigen dir die wichtigsten Funktionen.'
  },
  {
    title:
      'Nach welchen Kriterien werden Schüler:innen und Helfer:innen verbunden?',
    text: 'Möchtest du wissen, was unsere Plattform alles zu bieten hat? Wir zeigen dir die wichtigsten Funktionen.'
  }
]

const HelpCenter: React.FC<Props> = () => {
  const { space } = useTheme()

  return (
    <WithNavigation
      headerTitle="Hilfebereich"
      headerLeft={<ArrowBackIcon size="xl" color="lightText" />}
      headerRight={
        <Box>
          <Badge
            bgColor={'danger.500'}
            rounded="3xl"
            zIndex={1}
            variant="solid"
            alignSelf="flex-end"
            top="2"
            right="-5">
            {' '}
          </Badge>
          <DeleteIcon color="lightText" size="xl" />
        </Box>
      }>
      <Box
        paddingTop={space['4']}
        paddingBottom={space['1.5']}
        paddingX={space['1.5']}>
        <Heading paddingBottom={1.5}>Du brauchst Hilfe?</Heading>
        <Text>
          Schau doch mal hier in unseren FAQ, ob du eine Antwort auf deine
          Fragen findest. Solltest du nicht fündig werden kannst du dich auch an
          unseren Support oder das Mentoring wenden.
        </Text>
      </Box>
      <Box width="100%" paddingX={space['1.5']}>
        <Tabs
          tabs={[
            {
              title: 'FAQ',
              content: (
                <>
                  <Heading paddingBottom={space['2']}>
                    Häufig gestellte Frage
                  </Heading>

                  {faq.map(({ title, text }, index) => (
                    <Accordion title={title} key={`accordion-${index}`}>
                      <Text>{text}</Text>
                    </Accordion>
                  ))}

                  <Box paddingY={space['1.5']}>
                    <Button>Alle FAQ</Button>
                  </Box>
                </>
              )
            },
            {
              title: 'Hilfestellung',
              content: (
                <>
                  <Heading paddingBottom={1.5}>Hilfestellung</Heading>
                  <Text>
                    Hier findest du die wichtigsten Informationen und
                    Hilfestellungen für dich als Helfer:in.
                  </Text>
                </>
              )
            },
            {
              title: 'Kontakt',
              content: (
                <>
                  <Heading paddingBottom={space['0.5']}>
                    Kontaktformular
                  </Heading>
                  <Text paddingBottom={space['1.5']}>
                    Du hast Fragen oder bruchst Hilfe? Schreibe uns über das
                    Kontaktformular, wir helfen dir gerne weiter.
                  </Text>

                  <FormControl>
                    <Row flexDirection="column" paddingY={space['0.5']}>
                      <FormControl.Label>
                        Wie können wir dir helfen?
                      </FormControl.Label>
                      <Select
                        accessibilityLabel="Wähle das Thema"
                        placeholder="Wähle das Thema"
                        mt="1">
                        <Select.Item label="Support/Hilfe" value="support" />
                        <Select.Item label="Technischer Support" value="tech" />
                        <Select.Item label="Beratung" value="beratung" />
                      </Select>
                    </Row>
                    <Row flexDirection="column" paddingY={space['0.5']}>
                      <FormControl.Label>Deine Nachricht</FormControl.Label>
                      <TextArea
                        h={20}
                        placeholder="Deine Nachricht an uns"
                        autoCompleteType={{}}
                      />
                    </Row>
                    <Row flexDirection="column" paddingY={space['1.5']}>
                      <Checkbox value="dsgvo">
                        Hiermit stimme ich der
                        <Link href="#">Datenschutzerklärung</Link> zu.
                      </Checkbox>
                    </Row>
                    <Row flexDirection="column" paddingY={space['0.5']}>
                      <Button>Anfrage senden</Button>
                    </Row>
                  </FormControl>
                </>
              )
            }
          ]}
        />
      </Box>
    </WithNavigation>
  )
}
export default HelpCenter
