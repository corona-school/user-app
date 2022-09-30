import {
  VStack,
  Button,
  useTheme,
  Heading,
  FormControl,
  Text,
  Row,
  Switch,
  Box
} from 'native-base'
import { useContext, useMemo } from 'react'
import DatePicker from '../../components/DatePicker'
import TextInput from '../../components/TextInput'
import { CreateCourseContext } from '../CreateCourse'

type Props = {
  onNext: () => any
  onBack: () => any
}

const CourseAppointments: React.FC<Props> = ({ onNext, onBack }) => {
  const { space } = useTheme()
  const { lectures, setLectures } = useContext(CreateCourseContext)

  const isValidInput = useMemo(() => {
    if (!lectures || !lectures.length) return false
    for (const lec of lectures) {
      if (!lec.date) return false
      if (!lec.duration) return false
    }
    return true
  }, [lectures])

  return (
    <VStack space={space['1']}>
      <Heading>Lege Termine für deinen Kurs fest</Heading>
      <Text bold>Termine erstellen*</Text>
      <FormControl>
        <FormControl.Label isRequired>Datum</FormControl.Label>

        <DatePicker
          onChange={e => {
            if (!lectures) return
            const arr = (lectures.length > 1 && [...lectures]) || [lectures[0]]
            arr[0].date = e.target.value
            setLectures && setLectures(arr)
          }}
        />
        <Text fontSize="xs">
          Ein Kurs muss 7 Tage vor Kursbeginn angelegt werden.
        </Text>
      </FormControl>
      <FormControl>
        <FormControl.Label isRequired>Uhrzeit</FormControl.Label>
        <DatePicker
          type="time"
          onChange={e => {
            if (!lectures) return
            const arr = (lectures.length > 1 && [...lectures]) || [lectures[0]]
            arr[0].time = e.target.value
            setLectures && setLectures(arr)
          }}
        />
      </FormControl>
      <FormControl>
        <FormControl.Label isRequired>Dauer</FormControl.Label>
        <TextInput
          placeholder="Bessere Absprache zu UX"
          onChangeText={e => {
            if (!lectures) return
            const arr = (lectures.length > 1 && [...lectures]) || [
              lectures[0] || {}
            ]
            arr[0].duration = e
            setLectures && setLectures(arr)
          }}
        />
      </FormControl>
      <Row>
        <Text flex="1">Termin wiederholen</Text>
        <Switch />
      </Row>
      <Row>
        <Box bg={'primary.900'} w="32px" h="32px"></Box>
        <Text>Weiteren Termin anlegen</Text>
      </Row>
      <Button isDisabled={!isValidInput} onPress={onNext}>
        Angaben prüfen
      </Button>
      <Button variant={'outline'}>Als Entwurf speichern</Button>
      <Button variant={'outline'} onPress={onBack}>
        Zur vorherigen Seite
      </Button>
    </VStack>
  )
}
export default CourseAppointments
