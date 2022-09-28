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
import { useContext } from 'react'
import TextInput from '../../components/TextInput'
import { CreateCourseContext } from '../CreateCourse'

type Props = {
  onNext: () => any
  onBack: () => any
}

const CourseAppointments: React.FC<Props> = ({ onNext, onBack }) => {
  const { space } = useTheme()
  const data = useContext(CreateCourseContext)

  return (
    <VStack space={space['1']}>
      <Heading>Lege Termine für deinen Kurs fest</Heading>
      <Text bold>Termine erstellen*</Text>
      <FormControl>
        <FormControl.Label isRequired>Datum</FormControl.Label>
        <TextInput type="text" />
        <Text fontSize="xs">
          Ein Kurs muss 7 Tage vor Kursbeginn angelegt werden.
        </Text>
        {/* TODO MAKE DATE PICKER */}
      </FormControl>
      <FormControl>
        <FormControl.Label isRequired>Uhrzeit</FormControl.Label>
        <TextInput />
      </FormControl>
      <FormControl>
        <FormControl.Label isRequired>Dauer</FormControl.Label>
        <TextInput />
      </FormControl>
      <Row>
        <Text flex="1">Termin wiederholen</Text>
        <Switch />
      </Row>
      <Row>
        <Box bg={'primary.900'} w="32px" h="32px"></Box>
        <Text>Weiteren Termin anlegen</Text>
      </Row>
      <Button onPress={onNext}>Angaben prüfen</Button>
      <Button variant={'outline'}>Als Entwurf speichern</Button>
      <Button variant={'outline'} onPress={onBack}>
        Zur vorherigen Seite
      </Button>
    </VStack>
  )
}
export default CourseAppointments
