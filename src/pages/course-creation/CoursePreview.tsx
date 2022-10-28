import { useMatomo } from '@jonkoops/matomo-tracker-react'
import { DateTime } from 'luxon'
import {
  VStack,
  Button,
  useTheme,
  Heading,
  Text,
  Row,
  Box,
  Image,
  useBreakpointValue
} from 'native-base'
import { useContext, useEffect } from 'react'
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
  const { space, sizes } = useTheme()
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

  const ContainerWidth = useBreakpointValue({
    base: '100%',
    lg: sizes['containerWidth']
  })

  const ButtonContainer = useBreakpointValue({
    base: '100%',
    lg: sizes['desktopbuttonWidth']
  })

  const ButtonContainerDirection = useBreakpointValue({
    base: 'column',
    lg: 'row'
  })

  const { trackPageView, trackEvent } = useMatomo()

  useEffect(() => {
    trackPageView({
      documentTitle: 'Kurs erstellen – Vorschau'
    })
  }, [])

  return (
    <VStack space={space['1']} maxWidth={ContainerWidth}>
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
                    'yyyy-MM-dd',
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

      <Row
        space={space['1']}
        alignItems="center"
        flexDirection={ButtonContainerDirection}>
        <Button
          marginBottom={space['1']}
          width={ButtonContainer}
          onPress={() => {
            trackEvent({
              category: 'kurse',
              action: 'click-event',
              name: 'Helfer Kurs erstellen – veröffentlichen Button',
              documentTitle: 'Helfer Kurs erstellen – publish button'
            })
            onNext()
          }}
          isDisabled={isDisabled}>
          {t('course.CourseDate.Preview.publishCourse')}
        </Button>
        <Button
          marginBottom={space['1']}
          width={ButtonContainer}
          variant={'outline'}
          onPress={onBack}
          isDisabled={isDisabled}>
          {t('course.CourseDate.Preview.editCourse')}
        </Button>
      </Row>
    </VStack>
  )
}
export default CoursePreview
