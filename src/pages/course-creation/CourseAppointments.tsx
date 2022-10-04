import {
  VStack,
  Button,
  useTheme,
  Heading,
  FormControl,
  Text,
  Row,
  Switch,
  Box,
  Pressable
} from 'native-base'
import { useContext, useEffect, useMemo } from 'react'
import DatePicker from '../../components/DatePicker'
import TextInput from '../../components/TextInput'
import { CreateCourseContext } from '../CreateCourse'
import CourseDateWizard from './CourseDateWizard'

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
      if (!lec.time) return false
      if (!lec.duration) return false
    }
    return true
  }, [lectures])

  useEffect(() => {
    if (lectures?.length === 0) {
      setLectures &&
        setLectures(prev => [...prev, { time: '', duration: '', date: '' }])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  console.log(lectures)
  return (
    <VStack space={space['1']}>
      <Heading>Lege Termine für deinen Kurs fest</Heading>
      <Text bold>Termine erstellen*</Text>

      {lectures?.map((lec, i) => (
        <Row>
          <CourseDateWizard index={i} />
        </Row>
      ))}

      <Pressable
        isDisabled={!isValidInput}
        onPress={() =>
          setLectures &&
          setLectures(prev => [...prev, { time: '', date: '', duration: '' }])
        }>
        <Row>
          <Box bg={'primary.900'} w="32px" h="32px"></Box>
          <Text>Weiteren Termin anlegen</Text>
        </Row>
      </Pressable>

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
