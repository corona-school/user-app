import { Text, FormControl, Row, Switch, Heading, VStack } from 'native-base'
import { useContext } from 'react'
import DatePicker from '../../components/DatePicker'
import TextInput from '../../components/TextInput'
import { CreateCourseContext } from '../CreateCourse'

type Props = {
  index: number
}

const CourseDateWizard: React.FC<Props> = ({ index }) => {
  const { lectures, setLectures } = useContext(CreateCourseContext)

  return (
    <VStack w="100%">
      {(!!index || (lectures && lectures?.length > 1)) && (
        <Heading>Termin {`${index + 1}`.padStart(2, '0')}</Heading>
      )}
      <FormControl>
        <FormControl.Label isRequired>Datum</FormControl.Label>

        <DatePicker
          value={lectures && lectures[index].date}
          onChange={e => {
            if (!lectures || !lectures[index]) return
            const arr = [...lectures]
            arr[index].date = e.target.value
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
          value={lectures && lectures[index].time}
          onChange={e => {
            if (!lectures || !lectures[index]) return
            const arr = [...lectures]
            arr[index].time = e.target.value
            setLectures && setLectures(arr)
          }}
        />
      </FormControl>
      <FormControl>
        <FormControl.Label isRequired>Dauer</FormControl.Label>
        <TextInput
          value={lectures && lectures[index].duration}
          placeholder="Bessere Absprache zu UX"
          onChangeText={e => {
            if (!lectures || !lectures[index]) return
            const arr = [...lectures]
            arr[index].duration = e
            setLectures && setLectures(arr)
          }}
        />
      </FormControl>
      <Row>
        <Text flex="1">Termin wiederholen</Text>
        <Switch />
      </Row>
    </VStack>
  )
}
export default CourseDateWizard
