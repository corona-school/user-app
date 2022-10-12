import { DateTime } from 'luxon'
import {
  VStack,
  Button,
  useTheme,
  Heading,
  Text,
  Row,
  Box,
  Image
} from 'native-base'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import Tag from '../../components/Tag'
import ToggleButton from '../../components/ToggleButton'
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
    maxParticipantCount,
    tags,
    courseClasses,
    joinAfterStart,
    allowContact,
    lectures,
    pickedPhoto
  } = useContext(CreateCourseContext)

  return (
    <VStack space={space['1']}>
      <Heading>{t('course.CourseDate.Preview.headline')}</Heading>
      <Text>{t('course.CourseDate.Preview.content')}</Text>

      <Heading>{t('course.CourseDate.Preview.infoHeadline')}</Heading>
      <Row alignItems="end" space={space['0.5']}>
        <Text bold fontSize="md">
          {t('course.CourseDate.Preview.courseName')}
        </Text>
        <Text fontSize="md">{courseName}</Text>
      </Row>

      <Heading fontSize="md">
        {t('course.CourseDate.Preview.courseSubject')}
      </Heading>
      {subject && <IconTagList isDisabled text={subject.name || ''} />}

      <Box bg="gray.500" h="180">
        <Image src={pickedPhoto} h="100%" />
      </Box>

      <Heading fontSize="md">
        {t('course.CourseDate.Preview.shortDesc')}
      </Heading>
      <Text>{outline}</Text>

      <Heading fontSize="md">{t('course.CourseDate.Preview.desc')}</Heading>
      <Text>{description}</Text>

      <Heading fontSize="md">
        {t('course.CourseDate.Preview.tagHeadline')}
      </Heading>
      <Row space={space['0.5']}>
        {(tags &&
          tags.split(',').length &&
          tags.split(',').map(t => <Tag text={t} />)) || (
          <Text>Es wurden keine Tags angegeben.</Text>
        )}
      </Row>

      <Heading fontSize="md">
        {t('course.CourseDate.Preview.classHeadline')}
      </Heading>
      {courseClasses &&
        courseClasses.map(c => {
          const range = Utility.intToClassRange(c)
          return (
            <ToggleButton
              label={`${range.min}. - ${range.max}. Klasse`}
              dataKey={c.toString()}
              isActive={false}
            />
          )
        })}

      <VStack>
        <Row>
          <Text fontSize="md" bold>
            {t('course.CourseDate.Preview.membersCountLabel') + ' '}
          </Text>
          <Text fontSize="md">
            {t('course.CourseDate.Preview.membersCountMaxLabel')}
            {'. '}
            {maxParticipantCount}
          </Text>
        </Row>

        <Row>
          <Text fontSize="md" bold>
            {t('course.CourseDate.Preview.startDateLabel') + ' '}
          </Text>
          <Text fontSize="md">
            {joinAfterStart
              ? t('course.CourseDate.Preview.yes')
              : t('course.CourseDate.Preview.no')}
          </Text>
        </Row>
        <Row marginBottom={space['1']}>
          <Text fontSize="md" bold>
            {t('course.CourseDate.Preview.allowContactLabel') + '  '}
          </Text>
          <Text fontSize="md">
            {allowContact
              ? t('course.CourseDate.Preview.yes')
              : t('course.CourseDate.Preview.no')}
          </Text>
        </Row>
      </VStack>
      <Heading fontSize="lg" marginBottom={space['1']}>
        {t('course.CourseDate.Preview.appointmentHeadline')}
      </Heading>
      {lectures &&
        lectures.map((lec, i) => (
          <VStack marginBottom={space['1']}>
            <Heading mb={space['0.5']}>
              {t('course.CourseDate.Preview.appointmentLabel')}{' '}
              {`${i + 1}`.padStart(2, '0')}
            </Heading>
            <VStack>
              <Row>
                <Text bold minW="100px" fontSize="md">
                  {t('course.CourseDate.Preview.appointmentDate')}
                </Text>
                <Text fontSize="md">
                  {Utility.handleDateString(
                    lec.date,
                    'yyyy-mm-dd',
                    undefined,
                    DateTime.DATE_MED
                  )}
                </Text>
              </Row>
              <Row>
                <Text bold minW="100px" fontSize="md">
                  {t('course.CourseDate.Preview.appointmentTime')}
                </Text>
                <Text fontSize="md">
                  {Utility.handleDateString(
                    lec.time,
                    'hh:mm',
                    undefined,
                    DateTime.TIME_24_SIMPLE
                  )}
                  {' Uhr'}
                </Text>
              </Row>
              <Row>
                <Text bold minW="100px" fontSize="md">
                  {t('course.CourseDate.Preview.appointmentDuration')}
                </Text>
                <Text fontSize="md">{`${
                  parseInt(lec.duration) / 60
                } Stunden`}</Text>
              </Row>
            </VStack>
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
