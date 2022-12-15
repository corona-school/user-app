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
import { useCallback, useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Tag from '../../components/Tag'
import { LFLecture } from '../../types/lernfair/Course'
import { getSubjectKey, getSubjectLabel } from '../../types/lernfair/Subject'
import Utility from '../../Utility'
import AlertMessage from '../../widgets/AlertMessage'
import AppointmentInfoRow from '../../widgets/AppointmentInfoRow'
import IconTagList from '../../widgets/IconTagList'
import { CreateCourseContext } from '../CreateCourse'

type Props = {
  onNext: () => any
  onBack: () => any
  isDisabled?: boolean
  isError?: boolean
  prefillCourseId?: number | string
}

const CoursePreview: React.FC<Props> = ({
  onNext,
  onBack,
  isDisabled,
  isError,
  prefillCourseId
}) => {
  const { space, sizes } = useTheme()
  const { t } = useTranslation()
  const {
    courseName,
    subject,
    description,
    maxParticipantCount,
    tags,
    classRange: courseClasses,
    joinAfterStart,
    allowContact,
    lectures,
    newLectures,
    pickedPhoto
  } = useContext(CreateCourseContext)

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const convertTime = useCallback((_time: string) => {
    let time = parseInt(_time)

    return time >= 60 ? time / 60 + ' Stunden' : time + ' Minuten'
  }, [])

  return (
    <VStack space={space['1']}>
      <Heading paddingTop={space['1']}>
        {t('course.CourseDate.Preview.headline')}
      </Heading>
      <Text>{t('course.CourseDate.Preview.content')}</Text>

      <Heading>{t('course.CourseDate.Preview.infoHeadline')}</Heading>
      <Row alignItems="end" space={space['0.5']}>
        <Text bold fontSize="md">
          {t('course.CourseDate.Preview.courseName')}
        </Text>
        <Text fontSize="md">{courseName}</Text>
      </Row>

      {subject?.name && (
        <>
          <Heading fontSize="md">
            {t('course.CourseDate.Preview.courseSubject')}
          </Heading>
          <Box paddingBottom={space['0.5']}>
            {subject && (
              <>
                <IconTagList
                  iconPath={`subjects/icon_${getSubjectKey(subject.name)}.svg`}
                  isDisabled
                  text={getSubjectLabel(subject.name, true)}
                />
              </>
            )}
          </Box>
        </>
      )}

      <Row flexDirection="column" paddingBottom={space['0.5']}>
        <Heading fontSize="md" paddingBottom={space['0.5']}>
          {t('course.CourseDate.Preview.jahrgangsstufe')}
        </Heading>

        <Text>
          {t('course.CourseDate.Preview.classHeadline')}{' '}
          {courseClasses && courseClasses[0]} -{' '}
          {courseClasses && courseClasses[1]}
        </Text>
      </Row>

      <Row flexDirection="column" paddingBottom={space['0.5']}>
        <Heading fontSize="md" paddingBottom={space['0.5']}>
          {t('course.CourseDate.Preview.image')}
        </Heading>

        <Box bg="gray.500" h="180">
          <Image src={pickedPhoto} h="100%" />
        </Box>
      </Row>

      <Heading fontSize="md">{t('course.CourseDate.Preview.desc')}</Heading>
      <Text paddingBottom={space['0.5']}>{description}</Text>

      <Heading fontSize="md">
        {t('course.CourseDate.Preview.tagHeadline')}
      </Heading>
      <Row space={space['0.5']}>
        {(tags && tags.map(t => <Tag text={t.name} />)) || (
          <Text>{t('course.CourseDate.Preview.notags')}</Text>
        )}
      </Row>
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
      <Heading fontSize="xl" marginBottom={space['1']}>
        {t('course.CourseDate.Preview.appointmentHeadline')}
      </Heading>
      {lectures &&
        lectures.map((lecture: LFLecture, index: number) => (
          <AppointmentInfoRow index={index} lecture={lecture} />
        ))}
      {newLectures &&
        newLectures.length > 0 &&
        newLectures[0].date &&
        newLectures.map((lec, i) => (
          <VStack marginBottom={space['1']}>
            <Heading mb={space['0.5']} fontSize="lg">
              {t('course.CourseDate.Preview.appointmentLabel')}{' '}
              {`${i + ((lectures?.length || 0) + 1 || 1)}`.padStart(2, '0')}
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
                <Text fontSize="md">{convertTime(lec.duration)}</Text>
              </Row>
            </VStack>
          </VStack>
        ))}

      {isError && (
        <Box mt={space['1']}>
          <AlertMessage content={t('course.error.course')} />
        </Box>
      )}
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
          {(!!prefillCourseId && 'Änderungen speichern') ||
            t('course.CourseDate.Preview.publishCourse')}
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
