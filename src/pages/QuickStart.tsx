import { Box, Heading, useTheme, Text, Column, Stagger } from 'native-base'
import BackButton from '../components/BackButton'
import NotificationAlert from '../components/NotificationAlert'
import WithNavigation from '../components/WithNavigation'
import QuickStartCard from '../widgets/QuickStartCard'

type Props = {}

const quickstartcardContent = [
  {
    title: 'Ethische Standards',
    text: 'Die wichtigsten Grundlagen für einen verantwortungsbewusstes Handeln bei Lern-Fair.',
    link: 'https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    posttype: 'PDF',
    readingtime: 5,
    image:
      'https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80'
  },
  {
    title: 'Kennenlerngespräch',
    text: 'Alles, was du bei deinem Kennenlerngespräch berücksichtigen solltest.',
    link: 'https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    posttype: 'PDF',
    readingtime: 4,
    image:
      'https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80'
  },
  {
    title: 'Lehrpläne nach Bundesland',
    text: 'Geordnete Übersicht über alle Lehrpläne in den verschiedenen Bundesländern.',
    link: 'https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    posttype: 'PDF',
    readingtime: 2,
    image:
      'https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80'
  }
]

const QuickStart: React.FC<Props> = () => {
  const { space } = useTheme()

  return (
    <WithNavigation
      headerTitle="Quickstart"
      headerLeft={<BackButton />}
      headerRight={<NotificationAlert />}>
      <Box
        paddingTop={space['4']}
        paddingBottom={space['1.5']}
        paddingX={space['1.5']}>
        <Heading paddingBottom={1.5}>Quickstart</Heading>
        <Text>
          Willkommen bei Lern-Fair. Wir freuen uns, dass du
          bildungsbenachteiligte Kinder aktiv unterstützen möchtest. Hier
          findest du die wichtigsten Infos zum Einstieg.
        </Text>
      </Box>
      <Box width="100%" paddingX={space['1.5']}>
        <Stagger
          initial={{ opacity: 0, translateY: 20 }}
          animate={{
            opacity: 1,
            translateY: 0,
            transition: { stagger: { offset: 60 }, duration: 500 }
          }}
          visible>
          {quickstartcardContent.map(
            ({ title, text, image, readingtime, posttype, link }, index) => (
              <Column key={index} marginBottom={space['1.5']}>
                <QuickStartCard
                  image={image}
                  title={title}
                  readingtime={readingtime}
                  posttype={posttype}
                  url={link}
                  description={text}
                />
              </Column>
            )
          )}
        </Stagger>
      </Box>
    </WithNavigation>
  )
}
export default QuickStart
