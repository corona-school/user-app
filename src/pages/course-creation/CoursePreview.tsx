import { DateTime } from 'luxon'
import { VStack, Button, useTheme, Heading, Text, Row, Box } from 'native-base'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import Utility from '../../Utility'
import IconTagList from '../../widgets/IconTagList'
import { CreateCourseContext } from '../CreateCourse'

type Props = {
  onNext: () => any
  onBack: () => any
  isDisabled?: boolean
}

const CoursePreview: React.FC<Props> = ({ onNext, onBack, isDisabled }) => {
  const { space } = useTheme()
  const { t } = useTranslation()
  const {
    courseName,
    subject,
    outline,
    description,
    tags,
    courseClasses,
    joinAfterStart,
    allowContact,
    lectures
  } = useContext(CreateCourseContext)

  return (
    <VStack space={space['1']}>
      <Heading>{t('course.CourseDate.Preview.headline')}</Heading>
      <Text>{t('course.CourseDate.Preview.content')}</Text>

      <Heading>{t('course.CourseDate.Preview.infoHeadline')}</Heading>
      <Row>
        <Text bold>
          {t('course.CourseDate.Preview.infoHeadline')}
          <Text>{courseName}</Text>
        </Text>
      </Row>

      <Heading>{t('course.CourseDate.Preview.courseSubject')}</Heading>
      {subject && <IconTagList isDisabled text={subject.name || ''} />}

      <Box bg="gray.500" h="180"></Box>

      <Heading>{t('course.CourseDate.Preview.shortDesc')}</Heading>
      <Text>{outline}</Text>

      <Heading>{t('course.CourseDate.Preview.desc')}</Heading>
      <Text>{description}</Text>

      {tags && (
        <>
          <Heading>{t('course.CourseDate.Preview.tagHeadline')}</Heading>
          <Row>
            {tags.split(',').map(t => (
              <IconTagList text={t} isDisabled />
            ))}
          </Row>
        </>
      )}

      <Heading>{t('course.CourseDate.Preview.classHeadline')}</Heading>
      {courseClasses &&
        courseClasses.map(c => <IconTagList isDisabled text={`${c}`} />)}

      <Row>
        <Text bold>
          {t('course.CourseDate.Preview.membersCountLabel')}
          <Text>
            {t('course.CourseDate.Preview.membersCountMaxLabel')} {courseName}
          </Text>
        </Text>
      </Row>
      <Row>
        <Text bold>
          {t('course.CourseDate.Preview.startDateLabel')}
          <Text>
            {joinAfterStart
              ? t('course.CourseDate.Preview.yes')
              : t('course.CourseDate.Preview.no')}
          </Text>
        </Text>
      </Row>
      <Row>
        <Text bold>
          {t('course.CourseDate.Preview.allowContactLabel')}
          <Text>
            {allowContact
              ? t('course.CourseDate.Preview.yes')
              : t('course.CourseDate.Preview.no')}
          </Text>
        </Text>
      </Row>

      <Heading>{t('course.CourseDate.Preview.appointmentHeadline')}</Heading>
      {lectures &&
        lectures.map((lec, i) => (
          <VStack>
            <Heading>
              {t('course.CourseDate.Preview.appointmentLabel')}
              {`${i + 1}`.padStart(2, '0')}
            </Heading>
            <Text bold>
              {t('course.CourseDate.Preview.appointmentDate')}
              <Text>{Utility.formatDate(new Date(lec.date))}</Text>
            </Text>
            <Text bold>
              {t('course.CourseDate.Preview.appointmentTime')}
              <Text>
                {Utility.formatDate(
                  new Date(lec.time),
                  DateTime.TIME_24_SIMPLE
                )}
              </Text>
            </Text>
            <Text bold>
              {t('course.CourseDate.Preview.appointmentDuration')}
              <Text>{lec.duration}</Text>
            </Text>
          </VStack>
        ))}

      <Button onPress={onNext} isDisabled={isDisabled}>
        {t('course.CourseDate.Preview.publishCourse')}
      </Button>
      <Button variant={'outline'} onPress={onBack} isDisabled={isDisabled}>
        {t('course.CourseDate.Preview.editCourse')}
      </Button>
    </VStack>
  )
}
export default CoursePreview
