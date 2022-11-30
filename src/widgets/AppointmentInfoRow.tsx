import { DateTime } from 'luxon'
import { View, Text, VStack, Heading, Row, useTheme, Link } from 'native-base'
import { useTranslation } from 'react-i18next'
import { Lecture } from '../pages/CreateCourse'
import { LFLecture } from '../types/lernfair/Course'
import Utility from '../Utility'

type Props = {
  lecture: LFLecture
  index: number
  onPressDelete?: () => any
}

const AppointmentInfoRow: React.FC<Props> = ({
  lecture,
  index,
  onPressDelete
}) => {
  const { t } = useTranslation()
  const { space } = useTheme()

  return (
    <VStack marginBottom={space['1']}>
      <Row>
        <Heading mb={space['0.5']} fontSize="lg" flex="1">
          {t('course.CourseDate.Preview.appointmentLabel')}{' '}
          {`${index + 1}`.padStart(2, '0')}
        </Heading>
        {/* {<Link onPress={onPressDelete}>Termin löschen</Link>} */}
      </Row>

      <VStack>
        <Row>
          <Text bold minW="100px" fontSize="md">
            {t('course.CourseDate.Preview.appointmentDate')}
          </Text>

          <Text fontSize="md">
            {DateTime.fromISO(lecture.start).toFormat('dd.MM.yyyy')}
          </Text>
        </Row>
        <Row>
          <Text bold minW="100px" fontSize="md">
            {t('course.CourseDate.Preview.appointmentTime')}
          </Text>
          <Text fontSize="md">
            {DateTime.fromISO(lecture.start).toFormat('HH:mm')}
            {' Uhr'}
          </Text>
        </Row>
        <Row>
          <Text bold minW="100px" fontSize="md">
            {t('course.CourseDate.Preview.appointmentDuration')}
          </Text>
          <Text fontSize="md">{`${
            (typeof lecture.duration === 'string'
              ? parseInt(lecture.duration)
              : lecture.duration) / 60
          } Stunden`}</Text>
        </Row>
      </VStack>
    </VStack>
  )
}
export default AppointmentInfoRow
