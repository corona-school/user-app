import { useMatomo } from '@jonkoops/matomo-tracker-react'
import {
  Text,
  FormControl,
  Row,
  Heading,
  VStack,
  Select,
  useTheme,
  useBreakpointValue,
  Link
} from 'native-base'
import { useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import DatePicker from '../../components/DatePicker'
import { CreateCourseContext } from '../CreateCourse'

type Props = {
  index: number
  onPressDelete?: () => any
}

const CourseDateWizard: React.FC<Props> = ({ index, onPressDelete }) => {
  const { newLectures, setNewLectures } = useContext(CreateCourseContext)
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
      {(!!index || (newLectures && newLectures?.length > 1)) && (
        <Row alignItems={'center'}>
          <Heading marginBottom={space['1']} flex="1">
            {t('course.CourseDate.Wizard.headline')}
            {`${index + 1}`.padStart(2, ' 0')}
          </Heading>
          {index > 0 && <Link onPress={onPressDelete}>Termin löschen</Link>}
        </Row>
      )}
      <FormControl maxWidth={ContainerWidth}>
        <FormControl.Label isRequired _text={{ color: 'primary.900' }}>
          {t('course.CourseDate.Wizard.date')}
        </FormControl.Label>

        <Text paddingBottom="10px" fontSize="xs" color="primary.grey">
          {t('course.CourseDate.Wizard.dateInfo')}
        </Text>

        <DatePicker
          value={newLectures && newLectures[index].date}
          onChange={e => {
            if (!newLectures || !newLectures[index]) return
            const arr = [...newLectures]
            arr[index].date = e.target.value
            setNewLectures && setNewLectures(arr)
          }}
        />
      </FormControl>
      <FormControl marginY={space['1']}>
        <FormControl.Label isRequired _text={{ color: 'primary.900' }}>
          {t('course.CourseDate.Wizard.time')}
        </FormControl.Label>
        <DatePicker
          type="time"
          value={newLectures && newLectures[index].time}
          onChange={e => {
            if (!newLectures || !newLectures[index]) return
            const arr = [...newLectures]
            arr[index].time = e.target.value
            setNewLectures && setNewLectures(arr)
          }}
        />
      </FormControl>
      <FormControl marginY={space['1']}>
        <FormControl.Label isRequired _text={{ color: 'primary.900' }}>
          {t('course.CourseDate.Wizard.duration')}
        </FormControl.Label>

        <Select
          selectedValue={newLectures && newLectures[index].duration.toString()}
          placeholder={t('course.selectPlaceHolderDuration')}
          onValueChange={e => {
            if (!newLectures || !newLectures[index]) return
            const arr = [...newLectures]
            arr[index].duration = e
            setNewLectures && setNewLectures(arr)
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
      </FormControl>
    </VStack>
  )
}
export default CourseDateWizard
