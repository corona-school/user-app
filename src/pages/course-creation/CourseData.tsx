import {
  Text,
  VStack,
  Heading,
  FormControl,
  TextArea,
  Row,
  Box,
  Switch,
  Button,
  useTheme
} from 'native-base'
import { useContext } from 'react'
import TextInput from '../../components/TextInput'
import ToggleButton from '../../components/ToggleButton'
import IconTagList from '../../widgets/IconTagList'
import { CreateCourseContext } from '../CreateCourse'

type Props = {
  onNext: () => any
  onCancel: () => any
}

const subjects = [
  {
    name: 'Informatik',
    grade: {
      min: 11,
      max: 13
    }
  },
  {
    name: 'Englisch',
    grade: {
      min: 7,
      max: 13
    }
  }
]

const CourseData: React.FC<Props> = ({ onNext, onCancel }) => {
  const { space } = useTheme()
  const {
    setCourseName,
    subject,
    setSubject,
    setOutline,
    setDescription,
    setTags,
    setMaxParticipantCount,
    setJoinAfterStart,
    setAllowContact
  } = useContext(CreateCourseContext)

  return (
    <VStack space={space['1']}>
      <Heading>Allgemeine Informationen zu deinem Kurs</Heading>
      <FormControl>
        <FormControl.Label isRequired>Kursname</FormControl.Label>
        <TextArea
          placeholder="Kursname*"
          autoCompleteType={'normal'}
          onChangeText={setCourseName}
        />
      </FormControl>
      <FormControl>
        <FormControl.Label isRequired>Fach</FormControl.Label>
        <Row>
          {subjects.map(subject => (
            <IconTagList
              text={subject.name}
              onPress={() => setSubject && setSubject({ key: '', label: '' })}
            />
          ))}
        </Row>
      </FormControl>

      <FormControl>
        <FormControl.Label isRequired>Foto</FormControl.Label>
        <Box bg={'primary.100'} w="100" h="100"></Box>
      </FormControl>
      <FormControl>
        <FormControl.Label>Weitere Kursleiter hinzufügen</FormControl.Label>
        <Row>
          <Box bg={'primary.900'} w="32px" h="32px"></Box>
          <Text>Weiteren Kursleiter hinzufügen</Text>
        </Row>
      </FormControl>
      <FormControl>
        <FormControl.Label isRequired>Kurzbeschreibung</FormControl.Label>
        <TextArea
          placeholder="Kurzbeschreibung*"
          autoCompleteType={'normal'}
          onChangeText={setOutline}
        />
        <Text fontSize={'sm'}>Max. Zeichenanzahl: 140</Text>
      </FormControl>
      <FormControl>
        <FormControl.Label isRequired>Beschreibung</FormControl.Label>
        <TextArea
          placeholder="Beschreibung*"
          autoCompleteType={'normal'}
          onChangeText={setDescription}
        />
      </FormControl>
      <FormControl>
        <FormControl.Label>Tags</FormControl.Label>
        <TextArea
          placeholder="Tags"
          autoCompleteType={'normal'}
          onChangeText={setTags}
        />
        <Text fontSize={'sm'}>
          Die einzelnen Tags müssen durch ein Komma (,) getrennt werden
        </Text>
      </FormControl>
      <Heading>Details</Heading>
      <FormControl>
        <FormControl.Label>
          Für welche Klassen ist der Kurs geeignet?
        </FormControl.Label>

        <ToggleButton
          isActive={false}
          dataKey={subject?.key || 'subject'}
          // TODO split grades into selectable class ranges
          label={`${subject?.minGrade}. - ${subject?.maxGrade}. Klasse`}
        />
      </FormControl>
      <FormControl>
        <FormControl.Label isRequired>Max Teilnehmerzahl</FormControl.Label>
        <TextInput onChangeText={setMaxParticipantCount} />
        <Text fontSize={'sm'}>
          Gerne eine höhere Zahl angeben, da meist nur die Hälfte der
          angemeldeten Schüler:innen erscheint.
        </Text>
      </FormControl>

      <Heading>Sonstiges</Heading>
      <Row>
        <Text flex="1">Teilnehmende dürfen nach Kursbeginn beitreten</Text>
        <Switch onValueChange={setJoinAfterStart} />
      </Row>
      <Row>
        <Text flex="1">Kontaktaufnahme erlauben</Text>
        <Switch onValueChange={setAllowContact} />
      </Row>
      <Button onPress={onNext}>Weiter</Button>
      <Button variant={'outline'} onPress={onCancel}>
        Abbrechen
      </Button>
    </VStack>
  )
}
export default CourseData
