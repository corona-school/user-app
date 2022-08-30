import {
  Box,
  Heading,
  useTheme,
  Text,
  Image,
  Column,
  Row,
  Button
} from 'native-base'
import BackButton from '../components/BackButton'
import NotificationAlert from '../components/NotificationAlert'
import Tabs from '../components/Tabs'
import Tag from '../components/Tag'
import WithNavigation from '../components/WithNavigation'
import CourseTrafficLamp from '../widgets/CourseTrafficLamp'
import ProfilAvatar from '../widgets/ProfilAvatar'

type Props = {}

const SingleCourse: React.FC<Props> = () => {
  const { space } = useTheme()

  return (
    <WithNavigation
      headerTitle="Kurvendiskussion"
      headerLeft={<BackButton />}
      headerRight={<NotificationAlert />}>
      <Box paddingTop={space['4']} paddingX={space['1.5']}>
        <Box height="178px" marginBottom={space['1.5']}>
          <Image
            alt="kurvendiskussion"
            borderRadius="8px"
            position="absolute"
            w="100%"
            height="100%"
            source={{
              uri: 'https://images.unsplash.com/photo-1632571401005-458e9d244591?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1742&q=80'
            }}
          />
        </Box>
        <Box paddingBottom={space['0.5']}>
          <Row>
            <Column marginRight={space['0.5']}>
              <Tag text="Mathe" />
            </Column>
            <Column>
              <Tag text="Gruppenkurs" />
            </Column>
          </Row>
        </Box>
        <Text paddingBottom={space['0.5']}>Ab 28.07.22 • 13:30 Uhr</Text>
        <Heading paddingBottom={1.5}>
          Diskussionen in Mathe!? – Die Kurvendiskussion
        </Heading>
        <Row alignItems="center" paddingBottom={space['1']}>
          <ProfilAvatar
            size="sm"
            image="https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
          />
          <Heading marginLeft={space['0.5']} fontSize="md">
            Max Mustermann
          </Heading>
        </Row>
        <Text paddingBottom={space['1']}>
          In diesem Kurs gehen wir die Schritte einer Kurvendiskussion von
          Nullstellen über Extrema bis hin zu Wendepunkten durch.
        </Text>

        <Box>
          <CourseTrafficLamp status="last" />
        </Box>

        <Tabs
          tabs={[
            {
              title: 'Beschreibung',
              content: (
                <>
                  <Text paddingBottom={space['0.5']}>
                    Kurvendiskussionen machen einen großen Teil im
                    Matheunterricht und somit auch in Prüfungen aus. Deshalb
                    werden wir uns in fünf Lektionen mit je 60 Minuten ausgiebig
                    damit beschäftigen.
                  </Text>
                  <Text paddingBottom={space['0.5']}>
                    Stattfinden wird der Kurs über Jitsi, also über die
                    Plattform hier. Arbeitsblätter, u.Ä. werde ich den
                    Kursteilnehmer:innen per E-Mail zukommen lassen.
                  </Text>
                  <Text paddingBottom={space['1.5']}>
                    Ich freue mich über Dein Interesse!
                  </Text>
                  <Box marginBottom={space['0.5']}>
                    <Button marginBottom={space['0.5']}>Anmelden</Button>
                  </Box>
                  <Box marginBottom={space['1.5']}>
                    <Button variant="outline">Kontakt aufnehmen</Button>
                  </Box>
                </>
              )
            },
            {
              title: 'Hilfestellung',
              content: (
                <>
                  <Row flexDirection="row" paddingBottom={space['0.5']}>
                    <Text bold marginRight={space['0.5']}>
                      Kategorie:
                    </Text>
                    <Text>Repetitorium</Text>
                  </Row>
                  <Row flexDirection="row" paddingBottom={space['0.5']}>
                    <Text bold marginRight={space['0.5']}>
                      Teilnehmende:
                    </Text>
                    <Text>4/20</Text>
                  </Row>
                  <Row flexDirection="row" paddingBottom={space['0.5']}>
                    <Text bold marginRight={space['0.5']}>
                      Anzahl:
                    </Text>
                    <Text>5 Lektionen</Text>
                  </Row>
                  <Row flexDirection="row" paddingBottom={space['0.5']}>
                    <Text bold marginRight={space['0.5']}>
                      Dauer:
                    </Text>
                    <Text>Max. 60 Minuten</Text>
                  </Row>
                  <Row flexDirection="row" paddingBottom={space['1.5']}>
                    <Text bold marginRight={space['0.5']}>
                      Tutor:innen:
                    </Text>
                    <Text>Max Mustermann</Text>
                  </Row>
                  <Box marginBottom={space['0.5']}>
                    <Button marginBottom={space['0.5']}>Anmelden</Button>
                  </Box>
                  <Box marginBottom={space['1.5']}>
                    <Button variant="outline">Kontakt aufnehmen</Button>
                  </Box>
                </>
              )
            },
            {
              title: 'Lektionen',
              content: (
                <>
                  <Row flexDirection="column" marginBottom={space['1.5']}>
                    <Heading paddingBottom={space['0.5']} fontSize="md">
                      Lektion 1
                    </Heading>
                    <Text paddingBottom={space['0.5']}>
                      28.07.22 • 13:30 Uhr
                    </Text>
                    <Text paddingBottom={space['0.5']}>
                      Die 1te Lektion fand vor 4 Tagen statt und dauerte
                      ungefähr 60min. Der Kurs ist für Schüler in der 5 - 7
                      Klasse.
                    </Text>
                  </Row>
                  <Row flexDirection="column" marginBottom={space['1.5']}>
                    <Heading paddingBottom={space['0.5']} fontSize="md">
                      Lektion 2
                    </Heading>
                    <Text paddingBottom={space['0.5']}>
                      28.07.22 • 13:30 Uhr
                    </Text>
                    <Text paddingBottom={space['0.5']}>
                      Die 2te Lektion fand vor 3 Tagen statt und dauerte
                      ungefähr 60min. Der Kurs ist für Schüler in der 10-13
                      Klasse.
                    </Text>
                  </Row>
                  <Row flexDirection="column" marginBottom={space['1.5']}>
                    <Heading paddingBottom={space['0.5']} fontSize="md">
                      Lektion 3
                    </Heading>
                    <Text paddingBottom={space['0.5']}>
                      28.07.22 • 13:30 Uhr
                    </Text>
                    <Text paddingBottom={space['0.5']}>
                      Die 3te Lektion fand vor 3 Tagen statt und dauerte
                      ungefähr 60min. Der Kurs ist für Schüler in der 10-13
                      Klasse.
                    </Text>
                  </Row>
                  <Row flexDirection="column" marginBottom={space['1.5']}>
                    <Heading paddingBottom={space['0.5']} fontSize="md">
                      Lektion 4
                    </Heading>
                    <Text paddingBottom={space['0.5']}>
                      28.07.22 • 13:30 Uhr
                    </Text>
                    <Text paddingBottom={space['0.5']}>
                      Die 4te Lektion fand vor 3 Tagen statt und dauerte
                      ungefähr 60min. Der Kurs ist für Schüler in der 10-13
                      Klasse.
                    </Text>
                  </Row>
                  <Row flexDirection="column" marginBottom={space['1.5']}>
                    <Heading paddingBottom={space['0.5']} fontSize="md">
                      Lektion 5
                    </Heading>
                    <Text paddingBottom={space['0.5']}>
                      28.07.22 • 13:30 Uhr
                    </Text>
                    <Text paddingBottom={space['0.5']}>
                      Die 5te Lektion fand vor 3 Tagen statt und dauerte
                      ungefähr 60min. Der Kurs ist für Schüler in der 10-13
                      Klasse.
                    </Text>
                  </Row>
                  <Box marginBottom={space['0.5']}>
                    <Button marginBottom={space['0.5']}>Anmelden</Button>
                  </Box>
                  <Box marginBottom={space['1.5']}>
                    <Button variant="outline">Kontakt aufnehmen</Button>
                  </Box>
                </>
              )
            },
            {
              title: 'Teilnehmer',
              content: (
                <>
                  <Row marginBottom={space['1.5']} alignItems="center">
                    <Column marginRight={space['1']}>
                      <ProfilAvatar
                        size="md"
                        image="https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                      />
                    </Column>
                    <Column>
                      <Heading fontSize="md">Linda</Heading>
                      <Text>13 Jahre aus Köln</Text>
                    </Column>
                  </Row>
                  <Row marginBottom={space['1.5']} alignItems="center">
                    <Column marginRight={space['1']}>
                      <ProfilAvatar
                        size="md"
                        image="https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                      />
                    </Column>
                    <Column>
                      <Heading fontSize="md">Nadine</Heading>
                      <Text>15 Jahre aus Essen</Text>
                    </Column>
                  </Row>
                  <Row marginBottom={space['1.5']} alignItems="center">
                    <Column marginRight={space['1']}>
                      <ProfilAvatar
                        size="md"
                        image="https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                      />
                    </Column>
                    <Column>
                      <Heading fontSize="md">Mario</Heading>
                      <Text>13 Jahre aus Düsseldorf</Text>
                    </Column>
                  </Row>
                  <Row marginBottom={space['1.5']} alignItems="center">
                    <Column marginRight={space['1']}>
                      <ProfilAvatar
                        size="md"
                        image="https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                      />
                    </Column>
                    <Column>
                      <Heading fontSize="md">Philip</Heading>
                      <Text>12 Jahre aus Aachen</Text>
                    </Column>
                  </Row>
                  <Row marginBottom={space['1.5']} alignItems="center">
                    <Column marginRight={space['1']}>
                      <ProfilAvatar
                        size="md"
                        image="https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                      />
                    </Column>
                    <Column>
                      <Heading fontSize="md">Kevin</Heading>
                      <Text>14 Jahre aus Aachen</Text>
                    </Column>
                  </Row>
                  <Row marginBottom={space['1.5']} alignItems="center">
                    <Column marginRight={space['1']}>
                      <ProfilAvatar
                        size="md"
                        image="https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                      />
                    </Column>
                    <Column>
                      <Heading fontSize="md">Patrick</Heading>
                      <Text>14 Jahre aus Stolberg</Text>
                    </Column>
                  </Row>
                  <Row marginBottom={space['1.5']} alignItems="center">
                    <Column marginRight={space['1']}>
                      <ProfilAvatar
                        size="md"
                        image="https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                      />
                    </Column>
                    <Column>
                      <Heading fontSize="md">Kevin</Heading>
                      <Text>14 Jahre aus Düsseldorf</Text>
                    </Column>
                  </Row>
                  <Box marginBottom={space['0.5']}>
                    <Button marginBottom={space['0.5']}>Anmelden</Button>
                  </Box>
                  <Box marginBottom={space['1.5']}>
                    <Button variant="outline">Kontakt aufnehmen</Button>
                  </Box>
                </>
              )
            }
          ]}
        />
      </Box>
    </WithNavigation>
  )
}
export default SingleCourse
