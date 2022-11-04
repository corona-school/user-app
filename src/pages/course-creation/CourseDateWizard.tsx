import { useMatomo } from '@jonkoops/matomo-tracker-react'
import {
  Text,
  FormControl,
  Row,
  Switch,
  Heading,
  VStack,
  Select,
  useTheme,
  useBreakpointValue
} from 'native-base'
import { useContext, useEffect } from 'react'
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
  const { space, sizes } = useTheme()

  const ContainerWidth = useBreakpointValue({
    base: '100%',
    lg: sizes['containerWidth']
  })

  const ContentContainerWidth = useBreakpointValue({
    base: '100%',
    lg: sizes['contentContainerWidth']
  })

  const { trackPageView } = useMatomo()

  useEffect(() => {
    trackPageView({
      documentTitle: 'Kurs erstellen – Daten'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <VStack marginX="auto" width="100%" maxWidth={ContentContainerWidth}>
      {(!!index || (lectures && lectures?.length > 1)) && (
        <Heading marginBottom={space['1']}>
          {t('course.CourseDate.Wizard.headline')}
          {`${index + 1}`.padStart(2, ' 0')}
        </Heading>
      )}
      <FormControl maxWidth={ContainerWidth}>
        <FormControl.Label isRequired _text={{ color: 'primary.900' }}>
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
        <Text paddingTop={space['1']} fontSize="xs">
          {t('course.CourseDate.Wizard.dateInfo')}
        </Text>
      </FormControl>
      <FormControl marginY={space['1']}>
        <FormControl.Label isRequired _text={{ color: 'primary.900' }}>
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
      <FormControl marginY={space['1']}>
        <FormControl.Label isRequired _text={{ color: 'primary.900' }}>
          {t('course.CourseDate.Wizard.duration')}
        </FormControl.Label>
        <Select
          selectedValue={lectures && lectures[index].duration}
          placeholder={t('course.selectPlaceHolderDuration')}
          onValueChange={e => {
            if (!lectures || !lectures[index]) return
            const arr = [...lectures]
            arr[index].duration = e
            setLectures && setLectures(arr)
          }}>
          <Select.Item value="15" label="15 Minuten" />
          <Select.Item value="30" label="30 Minuten" />
          <Select.Item value="45" label="45 Minuten" />
          <Select.Item value="60" label="1 Stunde" />
          <Select.Item value="90" label="90 Minuten" />
          <Select.Item value="120" label="2 Stunden" />
          <Select.Item value="180" label="3 Stunden" />
          <Select.Item value="240" label="4 Stunden" />
        </Select>
        {/* <TextInput
          value={lectures && lectures[index].duration}
          placeholder={t('course.CourseDate.Wizard.durationPlaceholder')}
          onChangeText={e => {
            if (!lectures || !lectures[index]) return
            const arr = [...lectures]
            arr[index].duration = e
            setLectures && setLectures(arr)
          }} 
        />*/}
      </FormControl>
      {/* <Row marginY={space['1.5']}>
        <Text flex="1">{t('course.CourseDate.Wizard.repeatAppoint')}</Text>
        <Switch />
      </Row> */}
    </VStack>
  )
}
export default CourseDateWizard
