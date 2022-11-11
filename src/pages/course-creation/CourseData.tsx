import { gql, useQuery } from '@apollo/client'
import {
  Text,
  VStack,
  Heading,
  FormControl,
  TextArea,
  Row,
  Box,
  Switch,
  Button,
  useTheme,
  Input,
  Pressable,
  Image,
  Column,
  Link,
  useBreakpointValue,
  Tooltip,
  InfoIcon
} from 'native-base'
import { useContext, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { getSubjectKey, LFSubject } from '../../types/lernfair/Subject'
import IconTagList from '../../widgets/IconTagList'
import { CreateCourseContext } from '../CreateCourse'
import ImagePlaceHolder from '../../assets/images/globals/image-placeholder.png'
import { useMatomo } from '@jonkoops/matomo-tracker-react'
import { Slider } from '@miblanchard/react-native-slider'
import InstructorRow from '../../widgets/InstructorRow'
import { LFInstructor } from '../../types/lernfair/Course'

const MAX_OUTLINE_LENGTH = 140

const WidgetAddInstructor: React.FC<{ onPress: () => any }> = ({ onPress }) => {
  const { t } = useTranslation()

  return (
    <Pressable onPress={onPress} alignItems="center" flexDirection="row">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg={'primary.900'}
        w="40px"
        h="40px"
        marginRight="15px"
        borderRadius="10px">
        <Text color="white" fontSize="32px">
          +
        </Text>
      </Box>
      <Text bold>{t('course.CourseDate.form.courseAddOntherLeadText')}</Text>
    </Pressable>
  )
}

const WidgetUnsplash: React.FC<{
  photo: string | undefined
  onShowUnsplash: () => any
}> = ({ photo, onShowUnsplash }) => {
  const { space } = useTheme()
  const { t } = useTranslation()
  return (
    <Pressable onPress={onShowUnsplash} flexDirection="row" alignItems="center">
      <Column marginRight={space['1']}>
        <Image
          width="90px"
          height="90px"
          alt="Image Placeholder"
          source={{
            uri: photo || ImagePlaceHolder
          }}
        />
      </Column>
      <Column>
        <Link>{t('course.uploadImage')}</Link>
      </Column>
    </Pressable>
  )
}

type Props = {
  onNext: () => any
  onCancel: () => any
  onShowUnsplash: () => any
  onShowAddInstructor: () => any
}

const CourseData: React.FC<Props> = ({
  onNext,
  onCancel,
  onShowUnsplash,
  onShowAddInstructor
}) => {
  const { data } = useQuery(gql`
    query {
      me {
        student {
          subjectsFormatted {
            name
            grade {
              min
              max
            }
          }
        }
      }
    }
  `)

  const { space, sizes, colors } = useTheme()
  const { t } = useTranslation()
  const {
    courseName,
    setCourseName,
    subject,
    setSubject,
    classRange,
    setClassRange,
    outline,
    setOutline,
    description,
    setDescription,
    tags,
    setTags,
    maxParticipantCount,
    setMaxParticipantCount,
    joinAfterStart,
    setJoinAfterStart,
    allowContact,
    setAllowContact,
    pickedPhoto,
    addedInstructors
  } = useContext(CreateCourseContext)

  const isValidInput: boolean = useMemo(() => {
    if (!courseName || courseName?.length < 3) return false
    if (!subject) return false
    if (!classRange || !classRange.length) return false
    if (!outline || outline.length < 5) return false
    if (!description || description.length < 5) return false
    if (!maxParticipantCount) return false
    if (!pickedPhoto) return false
    return true
  }, [
    classRange,
    courseName,
    description,
    maxParticipantCount,
    outline,
    pickedPhoto,
    subject
  ])

  const ButtonContainer = useBreakpointValue({
    base: '100%',
    lg: sizes['desktopbuttonWidth']
  })

  const ButtonContainerDirection = useBreakpointValue({
    base: 'column',
    lg: 'row'
  })

  const ContentContainerWidth = useBreakpointValue({
    base: '100%',
    lg: sizes['contentContainerWidth']
  })

  const { trackPageView, trackEvent } = useMatomo()

  useEffect(() => {
    trackPageView({
      documentTitle: 'Kurs erstellen – Page'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <VStack
      space={space['1']}
      marginX="auto"
      width="100%"
      maxWidth={ContentContainerWidth}>
      <Heading paddingY={space['1']}>{t('course.CourseDate.headline')}</Heading>
      <FormControl marginBottom={space['0.5']}>
        <FormControl.Label isRequired _text={{ color: 'primary.900' }}>
          {t('course.CourseDate.form.courseNameHeadline')}
        </FormControl.Label>
        <Input
          value={courseName}
          placeholder={t('course.CourseDate.form.courseNamePlaceholder')}
          autoCompleteType={'normal'}
          onChangeText={setCourseName}
        />
      </FormControl>
      <FormControl marginBottom={space['0.5']}>
        <FormControl.Label isRequired _text={{ color: 'primary.900' }}>
          {t('course.CourseDate.form.courseSubjectLabel')}
        </FormControl.Label>
        <Row space={space['1']}>
          {data?.me?.student?.subjectsFormatted.map((sub: LFSubject) => (
            <IconTagList
              initial={subject?.name === sub.name}
              text={sub.name}
              onPress={() => {
                setSubject && setSubject({ ...sub })
                setClassRange &&
                  setClassRange([sub.grade?.min || 1, sub.grade?.max || 13])
              }}
              iconPath={`subjects/icon_${getSubjectKey(sub.name)}.svg`}
            />
          ))}
        </Row>
      </FormControl>

      {subject?.name && (
        <FormControl>
          <FormControl.Label _text={{ color: 'primary.900', fontSize: 'md' }}>
            {t('course.CourseDate.form.detailsContent')}
          </FormControl.Label>

          <Text>
            {t(
              `Klassen ${(classRange && classRange[0]) || 1} - ${
                (classRange && classRange[1]) || 13
              }`
            )}
          </Text>
          <Box>
            <Slider
              animateTransitions
              minimumValue={1}
              maximumValue={13}
              minimumTrackTintColor={colors['primary']['500']}
              thumbTintColor={colors['primary']['900']}
              value={classRange || [1, 13]}
              step={1}
              onValueChange={(value: number | number[]) => {
                Array.isArray(value) &&
                  setClassRange &&
                  setClassRange([value[0], value[1]])
              }}
            />
          </Box>
        </FormControl>
      )}
      <FormControl marginBottom={space['0.5']}>
        <FormControl.Label isRequired _text={{ color: 'primary.900' }}>
          {t('course.CourseDate.form.coursePhotoLabel')}
        </FormControl.Label>
        <Box paddingY={space['1']}>
          <WidgetUnsplash photo={pickedPhoto} onShowUnsplash={onShowUnsplash} />
        </Box>
      </FormControl>
      <FormControl marginBottom={space['0.5']}>
        <Heading>Weitere Kursleiter</Heading>
        <VStack mt={space['1']}>
          {addedInstructors &&
            addedInstructors.map((instructor: LFInstructor) => (
              <InstructorRow instructor={instructor} />
            ))}
        </VStack>
        <Row space={space['0.5']} mt={space['1']}>
          <WidgetAddInstructor onPress={onShowAddInstructor} />
        </Row>
      </FormControl>
      <FormControl marginBottom={space['0.5']}>
        <FormControl.Label isRequired _text={{ color: 'primary.900' }}>
          {t('course.CourseDate.form.shortDescriptionLabel')}
        </FormControl.Label>
        <TextArea
          marginBottom={space['0.5']}
          placeholder={t('course.CourseDate.form.shortDescriptionPlaceholder')}
          autoCompleteType={'normal'}
          value={outline}
          onChangeText={text =>
            setOutline && setOutline(text.substring(0, MAX_OUTLINE_LENGTH))
          }
        />
        <Text fontSize="xs" color="primary.grey">
          {t('course.CourseDate.form.shortDescriptionLimitNotice')}
        </Text>
      </FormControl>
      <FormControl marginBottom={space['0.5']}>
        <FormControl.Label isRequired _text={{ color: 'primary.900' }}>
          {t('course.CourseDate.form.descriptionLabel')}
        </FormControl.Label>
        <TextArea
          placeholder={t('course.CourseDate.form.descriptionPlaceholder')}
          autoCompleteType={'normal'}
          value={description}
          onChangeText={setDescription}
        />
      </FormControl>
      <FormControl marginBottom={space['0.5']}>
        <FormControl.Label _text={{ color: 'primary.900' }} marginBottom="5px">
          {t('course.CourseDate.form.tagsLabel')}
        </FormControl.Label>
        <Input
          height="45px"
          marginBottom={space['0.5']}
          placeholder={t('course.CourseDate.form.tagsPlaceholder')}
          autoCompleteType={'normal'}
          value={tags}
          onChangeText={setTags}
        />
        <Text fontSize="xs" color="primary.grey">
          {t('course.CourseDate.form.tagsInfo')}
        </Text>
      </FormControl>
      <Heading>{t('course.CourseDate.form.detailsHeadline')}</Heading>

      <FormControl marginBottom={space['2']}>
        <FormControl.Label isRequired _text={{ color: 'primary.900' }}>
          {t('course.CourseDate.form.maxMembersLabel')}
        </FormControl.Label>

        <Input
          keyboardType="numeric"
          value={maxParticipantCount}
          onChangeText={text => {
            const t = text.replace(/\D+/g, '')
            setMaxParticipantCount && setMaxParticipantCount(t)
          }}
          marginBottom={space['0.5']}
        />

        <Text fontSize="xs" color="primary.grey">
          {t('course.CourseDate.form.maxMembersInfo')}
        </Text>
      </FormControl>
      <Heading fontSize="md">
        {t('course.CourseDate.form.otherHeadline')}
      </Heading>
      <Row>
        <Text flex="1">{t('course.CourseDate.form.otherOptionStart')}</Text>
        <Switch value={joinAfterStart} onValueChange={setJoinAfterStart} />
      </Row>
      <Row marginBottom={space['2']}>
        <Text flex="1" justifyContent="center">
          {t('course.CourseDate.form.otherOptionContact')}
          <Tooltip
            maxWidth={500}
            label={t('course.CourseDate.form.otherOptionContactToolTip')}>
            <InfoIcon
              position="absolute"
              top="1px"
              paddingLeft="5px"
              color="danger.100"
            />
          </Tooltip>
        </Text>
        <Switch value={allowContact} onValueChange={setAllowContact} />
      </Row>
      <Row
        space={space['1']}
        alignItems="center"
        flexDirection={ButtonContainerDirection}>
        <Button
          width={ButtonContainer}
          isDisabled={!isValidInput}
          marginBottom={space['1']}
          onPress={onNext}>
          {t('course.CourseDate.form.button.continue')}
        </Button>
        <Button
          marginBottom={space['1']}
          width={ButtonContainer}
          variant={'outline'}
          onPress={() => {
            trackEvent({
              category: 'kurse',
              action: 'click-event',
              name: 'Helfer Kurs erstellen – Abbrechen',
              documentTitle: 'Helfer Kurs erstellen – Abbrechen'
            })
            onCancel()
          }}>
          {t('course.CourseDate.form.button.cancel')}
        </Button>
      </Row>
    </VStack>
  )
}
export default CourseData
