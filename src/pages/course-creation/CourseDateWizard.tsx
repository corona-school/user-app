import { Text, FormControl, Row, Switch, Heading, VStack } from 'native-base'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import DatePicker from '../../components/DatePicker'
import TextInput from '../../components/TextInput'
import { CreateCourseContext } from '../CreateCourse'

type Props = {
  index: number
}

const CourseDateWizard: React.FC<Props> = ({ index }) => {
  const { lectures, setLectures } = useContext(CreateCourseContext)
  const { t } = useTranslation()

  return (
    <VStack w="100%">
      {(!!index || (lectures && lectures?.length > 1)) && (
        <Heading>
          {t('course.CourseDate.Wizard.headline')}
          {`${index + 1}`.padStart(2, '0')}
        </Heading>
      )}
      <FormControl>
        <FormControl.Label isRequired>
          {t('course.CourseDate.Wizard.date')}
        </FormControl.Label>

        <DatePicker
          value={lectures && lectures[index].date}
          onChange={e => {
            if (!lectures || !lectures[index]) return
            const arr = [...lectures]
            arr[index].date = e.target.value
            setLectures && setLectures(arr)
          }}
        />
        <Text fontSize="xs">{t('course.CourseDate.Wizard.dateInfo')}</Text>
      </FormControl>
      <FormControl>
        <FormControl.Label isRequired>
          {t('course.CourseDate.Wizard.time')}
        </FormControl.Label>
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
        <FormControl.Label isRequired>
          {t('course.CourseDate.Wizard.duration')}
        </FormControl.Label>
        <TextInput
          value={lectures && lectures[index].duration}
          placeholder={t('course.CourseDate.Wizard.durationPlaceholder')}
          onChangeText={e => {
            if (!lectures || !lectures[index]) return
            const arr = [...lectures]
            arr[index].duration = e
            setLectures && setLectures(arr)
          }}
        />
      </FormControl>
      <Row>
        <Text flex="1">{t('course.CourseDate.Wizard.repeatAppoint')}</Text>
        <Switch />
      </Row>
    </VStack>
  )
}
export default CourseDateWizard
