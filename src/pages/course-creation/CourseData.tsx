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
  useBreakpointValue
} from 'native-base'
import { useContext, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import ToggleButton from '../../components/ToggleButton'
import { LFSubject } from '../../types/lernfair/Subject'
import IconTagList from '../../widgets/IconTagList'
import { CreateCourseContext } from '../CreateCourse'
import ImagePlaceHolder from '../../assets/images/globals/image-placeholder.png'
import { useMatomo } from '@jonkoops/matomo-tracker-react'

type Props = {
  onNext: () => any
  onCancel: () => any
  onShowUnsplash: () => any
}

const CourseData: React.FC<Props> = ({ onNext, onCancel, onShowUnsplash }) => {
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

  const { space, sizes } = useTheme()
  const { t } = useTranslation()
  const {
    courseName,
    setCourseName,
    subject,
    setSubject,
    courseClasses,
    setCourseClasses,
    outline,
    setOutline,
    description,
    setDescription,
    setTags,
    maxParticipantCount,
    setMaxParticipantCount,
    setJoinAfterStart,
    setAllowContact,
    pickedPhoto
  } = useContext(CreateCourseContext)

  type SplitGrade = { minGrade: number; maxGrade: number; id: number }

  const splitGrades: SplitGrade[] = useMemo(() => {
    const arr: SplitGrade[] = []

    if (subject?.grade?.max && subject.grade?.min) {
      if (subject.grade?.min < 13 && subject?.grade?.max >= 11) {
        arr.push({ minGrade: 11, maxGrade: 13, id: 4 })
      }
      if (subject.grade?.min < 10 && subject?.grade?.max >= 9) {
        arr.push({ minGrade: 9, maxGrade: 10, id: 3 })
      }
      if (subject.grade?.min < 8 && subject?.grade?.max >= 5) {
        arr.push({ minGrade: 5, maxGrade: 8, id: 2 })
      }
      if (subject.grade?.min > 1 && subject?.grade?.max < 4) {
        arr.push({ minGrade: 1, maxGrade: 4, id: 1 })
      }
    }

    return arr.reverse()
  }, [subject])

  const isValidInput: boolean = useMemo(() => {
    if (!courseName || courseName?.length < 3) return false
    if (!subject) return false
    if (!courseClasses || !courseClasses.length) return false
    if (!outline || outline.length < 5) return false
    if (!description || description.length < 5) return false
    if (!maxParticipantCount) return false
    return true
  }, [
    courseClasses,
    courseName,
    description,
    maxParticipantCount,
    outline,
    subject
  ])

  useEffect(() => {
    // TODO prefill
  }, [])

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
      documentTitle: 'Kurs erstellen – Page'
    })
  }, [])

  return (
    <VStack space={space['1']} maxWidth={ContainerWidth}>
      <Heading paddingY={space['1']}>{t('course.CourseDate.headline')}</Heading>
      <FormControl marginBottom={space['0.5']}>
        <FormControl.Label isRequired _text={{ color: 'primary.900' }}>
          {t('course.CourseDate.form.courseNameHeadline')}
        </FormControl.Label>
        <Input
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
              onPress={() => setSubject && setSubject({ ...sub })}
              iconPath={`languages/icon_${sub.name.toLowerCase()}.svg`}
            />
          ))}
        </Row>
      </FormControl>

      <FormControl marginBottom={space['0.5']}>
        <FormControl.Label isRequired _text={{ color: 'primary.900' }}>
          {t('course.CourseDate.form.coursePhotoLabel')}
        </FormControl.Label>
        <Box paddingY={space['1']}>
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
                  uri: pickedPhoto || ImagePlaceHolder
                }}
              />
            </Column>
            <Column>
              <Link>{t('course.uploadImage')}</Link>
            </Column>
          </Pressable>
        </Box>
      </FormControl>
      <FormControl marginBottom={space['0.5']}>
        <Row space={space['0.5']}>
          <Pressable
            onPress={() => alert('Funktion')}
            alignItems="center"
            flexDirection="row">
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
            <Text bold>
              {t('course.CourseDate.form.courseAddOntherLeadText')}
            </Text>
          </Pressable>
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
          onChangeText={setOutline}
        />
        <Text fontSize="xs">
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
          onChangeText={setTags}
        />
        <Text fontSize="xs">{t('course.CourseDate.form.tagsInfo')}</Text>
      </FormControl>
      <Heading>{t('course.CourseDate.form.detailsHeadline')}</Heading>
      <FormControl>
        <FormControl.Label _text={{ color: 'primary.900', fontSize: 'md' }}>
          {t('course.CourseDate.form.detailsContent')}
        </FormControl.Label>
        {splitGrades.map((grade: SplitGrade, i) => (
          <ToggleButton
            isActive={courseClasses?.includes(grade?.id) || false}
            dataKey={subject?.name || 'subject'}
            label={`${grade.minGrade}. - ${grade.maxGrade}. Klasse`}
            onPress={() => {
              if (courseClasses?.includes(grade?.id)) {
                setCourseClasses &&
                  setCourseClasses(prev => {
                    prev.splice(i, 1)
                    return [...prev]
                  })
              } else {
                setCourseClasses &&
                  setCourseClasses(prev => [...prev, grade.id])
              }
            }}
          />
        ))}
      </FormControl>
      <FormControl marginBottom={space['2']}>
        <FormControl.Label isRequired _text={{ color: 'primary.900' }}>
          {t('course.CourseDate.form.maxMembersLabel')}
        </FormControl.Label>
        <Input
          onChangeText={setMaxParticipantCount}
          marginBottom={space['0.5']}
        />
        <Text fontSize="xs">{t('course.CourseDate.form.maxMembersInfo')}</Text>
      </FormControl>
      <Heading fontSize="md">
        {t('course.CourseDate.form.otherHeadline')}
      </Heading>
      <Row>
        <Text flex="1">{t('course.CourseDate.form.otherOptionStart')}</Text>
        <Switch onValueChange={setJoinAfterStart} />
      </Row>
      <Row marginBottom={space['2']}>
        <Text flex="1">{t('course.CourseDate.form.otherOptionContact')}</Text>
        <Switch onValueChange={setAllowContact} />
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
