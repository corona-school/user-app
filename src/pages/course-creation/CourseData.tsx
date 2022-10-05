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
import { useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
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
    minGrade: 11,
    maxGrade: 13
  },
  {
    name: 'Englisch',
    minGrade: 7,
    maxGrade: 11
  }
]

const CourseData: React.FC<Props> = ({ onNext, onCancel }) => {
  const { space } = useTheme()
  const { t } = useTranslation()
  const {
    courseName,
    setCourseName,
    subject,
    setSubject,
    courseClasses,
    setCourseClasses,
    outline,
    setOutline,
    description,
    setDescription,
    setTags,
    maxParticipantCount,
    setMaxParticipantCount,
    setJoinAfterStart,
    setAllowContact
  } = useContext(CreateCourseContext)

  type SplitGrade = { minGrade: number; maxGrade: number; id: number }

  const splitGrades: SplitGrade[] = useMemo(() => {
    const arr: SplitGrade[] = []

    if (subject?.maxGrade && subject.minGrade) {
      if (subject.minGrade < 13 && subject.maxGrade >= 11) {
        arr.push({ minGrade: 11, maxGrade: 13, id: 4 })
      }
      if (subject.minGrade < 10 && subject.maxGrade >= 9) {
        arr.push({ minGrade: 9, maxGrade: 10, id: 3 })
      }
      if (subject.minGrade < 8 && subject.maxGrade >= 5) {
        arr.push({ minGrade: 5, maxGrade: 8, id: 2 })
      }
      if (subject.minGrade > 1 && subject.maxGrade < 4) {
        arr.push({ minGrade: 1, maxGrade: 4, id: 1 })
      }
    }

    return arr.reverse()
  }, [subject])

  const isValidInput: boolean = useMemo(() => {
    if (!courseName || courseName?.length < 3) return false
    if (!subject) return false
    if (!courseClasses || !courseClasses.length) return false
    if (!outline || outline.length < 5) return false
    if (!description || description.length < 5) return false
    if (!maxParticipantCount) return false
    return true
  }, [
    courseClasses,
    courseName,
    description,
    maxParticipantCount,
    outline,
    subject
  ])

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
          {subjects.map(sub => (
            <IconTagList
              initial={subject?.name === sub.name}
              text={sub.name}
              onPress={() =>
                setSubject && setSubject({ ...sub, key: '', label: '' })
              }
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
        {splitGrades.map((grade: SplitGrade, i) => (
          <ToggleButton
            isActive={courseClasses?.includes(grade?.id) || false}
            dataKey={subject?.key || 'subject'}
            label={`${grade.minGrade}. - ${grade.maxGrade}. Klasse`}
            onPress={() => {
              if (courseClasses?.includes(grade?.id)) {
                setCourseClasses &&
                  setCourseClasses(prev => {
                    prev.splice(i, 1)
                    return [...prev]
                  })
              } else {
                setCourseClasses &&
                  setCourseClasses(prev => [...prev, grade.id])
              }
            }}
          />
        ))}
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
      <Button isDisabled={!isValidInput} onPress={onNext}>
        Weiter
      </Button>
      <Button variant={'outline'} onPress={onCancel}>
        Abbrechen
      </Button>
    </VStack>
  )
}
export default CourseData
