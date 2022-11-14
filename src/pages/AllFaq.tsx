import { useMatomo } from '@jonkoops/matomo-tracker-react'
import { Box, Heading, useTheme, Text } from 'native-base'
import { useEffect } from 'react'
import Accordion from '../components/Accordion'
import BackButton from '../components/BackButton'
import NotificationAlert from '../components/Notification/NotificationAlert'
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

const AllFaq: React.FC<Props> = () => {
  const { space } = useTheme()
  const { trackPageView } = useMatomo()

  useEffect(() => {
    trackPageView({
      documentTitle: 'Alle FAQs'
    })
  }, [])

  return (
    <WithNavigation headerTitle="Alle FAQ" showBack>
      <Box paddingTop={space['4']} paddingX={space['1.5']}>
        <Heading paddingBottom={1.5}>Alle Fragen und Antworten</Heading>
        <Text paddingBottom={space['1']}>
          Hier findest du die wichtigsten Informationen und Hilfestellungen für
          dich als Helfer:in.
        </Text>
      </Box>
      <Box paddingX={space['1.5']} paddingY={space['1']}>
        {faq.map(({ title, text }, index) => (
          <Accordion title={title} key={`accordion-${index}`}>
            <Text>{text}</Text>
          </Accordion>
        ))}
      </Box>
    </WithNavigation>
  )
}
export default AllFaq
