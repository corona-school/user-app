import { VStack, Button, useTheme, Heading, Text, Row, Box } from 'native-base'
import { useContext } from 'react'
import IconTagList from '../../widgets/IconTagList'
import { CreateCourseContext } from '../CreateCourse'

type Props = {
  onNext: () => any
  onBack: () => any
  isDisabled?: boolean
}

const CoursePreview: React.FC<Props> = ({ onNext, onBack, isDisabled }) => {
  const { space } = useTheme()
  const {
    courseName,
    subject,
    outline,
    description,
    tags,
    courseClasses,
    joinAfterStart,
    allowContact,
    lectures
  } = useContext(CreateCourseContext)

  return (
    <VStack space={space['1']}>
      <Heading>Angaben überprüfen</Heading>
      <Text>
        Bitte überpüfe deine Angaben noch einmal, bevor du deinen Kurs
        veröffentlichst.
      </Text>

      <Heading>Allgemeine Informationen zu deinem Kurs</Heading>
      <Row>
        <Text bold>
          Kursname: <Text>{courseName}</Text>
        </Text>
      </Row>

      <Heading>Fach</Heading>
      {subject && <IconTagList isDisabled text={subject.name || ''} />}

      <Box bg="gray.500" h="180"></Box>

      <Heading>Kurzbeschreibung</Heading>
      <Text>{outline}</Text>

      <Heading>Beschreibung</Heading>
      <Text>{description}</Text>

      {tags && (
        <>
          <Heading>Tags</Heading>
          <Row>
            {tags.split(',').map(t => (
              <IconTagList text={t} isDisabled />
            ))}
          </Row>
        </>
      )}

      <Heading>Klassen</Heading>
      {courseClasses &&
        courseClasses.map(c => <IconTagList isDisabled text={`${c}`} />)}

      <Row>
        <Text bold>
          Teilnehmerzahl: <Text>Max {courseName}</Text>
        </Text>
      </Row>
      <Row>
        <Text bold>
          Beitreten nach Kursbeginn:{' '}
          <Text>{joinAfterStart ? 'Ja' : 'Nein'}</Text>
        </Text>
      </Row>
      <Row>
        <Text bold>
          Kontaktaufnahme erlauben: <Text>{allowContact ? 'Ja' : 'Nein'}</Text>
        </Text>
      </Row>

      <Heading>Termine zum Kurs</Heading>
      {lectures &&
        lectures.map((lec, i) => (
          <VStack>
            <Heading>Termin {`${i + 1}`.padStart(2, '0')}</Heading>
            <Text bold>
              Datum:<Text>{lec.date}</Text>
            </Text>
            <Text bold>
              Uhrzeit:<Text>{lec.time}</Text>
            </Text>
            <Text bold>
              Dauer:<Text>{lec.duration}</Text>
            </Text>
          </VStack>
        ))}

      <Button onPress={onNext} isDisabled={isDisabled}>
        Kurs veröffentlichen
      </Button>
      <Button variant={'outline'} onPress={onBack} isDisabled={isDisabled}>
        Daten bearbeiten
      </Button>
    </VStack>
  )
}
export default CoursePreview
