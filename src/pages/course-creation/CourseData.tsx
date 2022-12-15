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
import { useContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getSubjectLabel, subjects } from '../../types/lernfair/Subject'
import IconTagList from '../../widgets/IconTagList'
import { CreateCourseContext } from '../CreateCourse'
import ImagePlaceHolder from '../../assets/images/globals/image-placeholder.png'
import { useMatomo } from '@jonkoops/matomo-tracker-react'
import { Slider } from '@miblanchard/react-native-slider'
import InstructorRow from '../../widgets/InstructorRow'
import { LFInstructor, LFTag } from '../../types/lernfair/Course'
import Tags from '../../modals/Tags'
import Tag from '../../components/Tag'

const MAX_TITLE = 50

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
  onDeletePhoto?: () => any
  prefill?: string
}> = ({ photo, onShowUnsplash, onDeletePhoto, prefill }) => {
  const { space } = useTheme()

  return (
    <>
      <Pressable
        onPress={onShowUnsplash}
        flexDirection="row"
        alignItems="center">
        <Column marginRight={space['1']}>
          <Image
            width="90px"
            height="90px"
            alt="Image Placeholder"
            source={{
              uri: photo || prefill || ImagePlaceHolder
            }}
          />
        </Column>
        <Column>
          <Link>Bild ändern</Link>
        </Column>
      </Pressable>
      {photo && (
        <Button
          variant="link"
          justifyContent="flex-start"
          pl="0"
          onPress={onDeletePhoto}>
          {prefill ? 'Bild zurücksetzen' : 'Bild löschen'}
        </Button>
      )}
    </>
  )
}

type Props = {
  onNext: () => any
  onCancel: () => any
  onShowUnsplash: () => any
  onShowAddInstructor: () => any
  onRemoveInstructor?: (index: number, isSubmitted: boolean) => any
}

const CourseData: React.FC<Props> = ({
  onNext,
  onCancel,
  onShowUnsplash,
  onShowAddInstructor,
  onRemoveInstructor
}) => {
  const { space, sizes, colors } = useTheme()
  const { t } = useTranslation()
  const {
    courseName,
    setCourseName,
    subject,
    setSubject,
    classRange,
    setClassRange,
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
    setPickedPhoto,
    addedInstructors,
    newInstructors,
    image
  } = useContext(CreateCourseContext)

  const [showTagsModal, setShowTagsModal] = useState<boolean>(false)

  const isValidInput: boolean = useMemo(() => {
    if (!courseName || courseName?.length < 3) return false
    if (!classRange || !classRange.length) return false
    if (!description || description.length < 5) return false
    if (!maxParticipantCount) return false
    return true
  }, [classRange, courseName, description, maxParticipantCount])

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

  const deletePhoto = () => {
    if (pickedPhoto) {
      setPickedPhoto && setPickedPhoto('')
    }
  }

  return (
    <>
      <VStack
        space={space['1']}
        marginX="auto"
        width="100%"
        maxWidth={ContentContainerWidth}>
        <Heading paddingY={space['1']}>
          {t('course.CourseDate.headline')}
        </Heading>
        <FormControl marginBottom={space['0.5']}>
          <FormControl.Label isRequired _text={{ color: 'primary.900' }}>
            {t('course.CourseDate.form.courseNameHeadline')}
          </FormControl.Label>
          <Input
            marginBottom={space['0.5']}
            value={courseName}
            placeholder={t('course.CourseDate.form.courseNamePlaceholder')}
            autoCompleteType={'normal'}
            onChangeText={text =>
              setCourseName && setCourseName(text.substring(0, MAX_TITLE))
            }
          />
          <Text fontSize="xs" color="primary.grey">
            {t('characterLimitNotice', {
              limit: MAX_TITLE
            })}
          </Text>
        </FormControl>
        <FormControl marginBottom={space['0.5']}>
          <FormControl.Label _text={{ color: 'primary.900' }}>
            {t('course.CourseDate.form.courseSubjectLabel')}
          </FormControl.Label>
          <Row flexWrap={'wrap'}>
            {subjects.map(
              (sub: { key: string; label: string; formatted?: string }) => (
                <Column marginRight={space['1']} marginBottom={space['0.5']}>
                  <IconTagList
                    initial={subject?.name === (sub.formatted || sub.label)}
                    text={sub.label}
                    onPress={() => {
                      setSubject &&
                        setSubject({ name: sub.formatted || sub.label })
                      // setClassRange &&
                      //   setClassRange([sub.grade?.min || 1, sub.grade?.max || 13])
                    }}
                    iconPath={`subjects/icon_${sub.key}.svg`}
                  />
                </Column>
              )
            )}
          </Row>
        </FormControl>

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

        <FormControl marginBottom={space['0.5']}>
          <FormControl.Label _text={{ color: 'primary.900' }}>
            {t('course.CourseDate.form.coursePhotoLabel')}
          </FormControl.Label>
          <Box paddingY={space['1']}>
            <WidgetUnsplash
              photo={pickedPhoto}
              prefill={image}
              onShowUnsplash={onShowUnsplash}
              onDeletePhoto={deletePhoto}
            />
          </Box>
        </FormControl>
        <FormControl marginBottom={space['0.5']}>
          <Heading>Weitere Kursleiter</Heading>
          <VStack mt={space['1']}>
            {addedInstructors &&
              addedInstructors.map(
                (instructor: LFInstructor, index: number) => (
                  <InstructorRow
                    instructor={instructor}
                    onPressDelete={() =>
                      onRemoveInstructor && onRemoveInstructor(index, true)
                    }
                  />
                )
              )}
            {newInstructors &&
              newInstructors.map((instructor: LFInstructor, index: number) => (
                <InstructorRow
                  instructor={instructor}
                  onPressDelete={() =>
                    onRemoveInstructor && onRemoveInstructor(index, false)
                  }
                />
              ))}
          </VStack>
          <Row space={space['0.5']} mt={space['1']}>
            <WidgetAddInstructor onPress={onShowAddInstructor} />
          </Row>
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
          <FormControl.Label
            _text={{ color: 'primary.900' }}
            marginBottom="5px">
            {t('course.CourseDate.form.tagsLabel')}
          </FormControl.Label>
          {/* <Input
            height="45px"
            marginBottom={space['0.5']}
            placeholder={t('course.CourseDate.form.tagsPlaceholder')}
            autoCompleteType={'normal'}
            value={tags}
            onChangeText={setTags}
          /> */}
          <Row>
            {tags?.map((tag: LFTag) => (
              <Column mr={space['0.5']}>
                <Tag text={tag.name} />
              </Column>
            ))}
          </Row>
          <Button
            width={ButtonContainer}
            marginBottom={space['1']}
            onPress={() => setShowTagsModal(true)}>
            Tags bearbeiten
          </Button>
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
          <Text flex="1">
            {t('course.CourseDate.form.otherOptionStart')}
            <Tooltip
              maxWidth={500}
              label={t('course.CourseDate.form.otherOptionStartToolTip')}>
              <InfoIcon
                position="relative"
                top="3px"
                paddingLeft="5px"
                color="danger.100"
              />
            </Tooltip>
          </Text>
          <Switch value={joinAfterStart} onValueChange={setJoinAfterStart} />
        </Row>
        <Row marginBottom={space['2']}>
          <Text flex="1" justifyContent="center">
            {t('course.CourseDate.form.otherOptionContact')}
            <Tooltip
              maxWidth={500}
              label={t('course.CourseDate.form.otherOptionContactToolTip')}>
              <InfoIcon
                paddingLeft="5px"
                position="relative"
                top="3px"
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
      <Tags
        isOpen={showTagsModal}
        onClose={() => setShowTagsModal(false)}
        selections={tags || []}
        onSelectTag={(tag: LFTag) => setTags && setTags(prev => [...prev, tag])}
        onDeleteTag={(index: number) => {
          const arr = (tags && tags?.length > 0 && [...tags]) || []
          arr.splice(index, 1)
          setTags && setTags(arr)
        }}
      />
    </>
  )
}
export default CourseData
