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
  useTheme
} from 'native-base'
import { useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import TextInput from '../../components/TextInput'
import ToggleButton from '../../components/ToggleButton'
import IconTagList from '../../widgets/IconTagList'
import { CreateCourseContext } from '../CreateCourse'

type Props = {
  onNext: () => any
  onCancel: () => any
}

const subjects = [
  {
    name: 'Informatik',
    minGrade: 11,
    maxGrade: 13
  },
  {
    name: 'Englisch',
    minGrade: 7,
    maxGrade: 11
  }
]

const CourseData: React.FC<Props> = ({ onNext, onCancel }) => {
  const { space } = useTheme()
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
    setAllowContact
  } = useContext(CreateCourseContext)

  type SplitGrade = { minGrade: number; maxGrade: number; id: number }

  const splitGrades: SplitGrade[] = useMemo(() => {
    const arr: SplitGrade[] = []

    if (subject?.maxGrade && subject.minGrade) {
      if (subject.minGrade < 13 && subject.maxGrade >= 11) {
        arr.push({ minGrade: 11, maxGrade: 13, id: 4 })
      }
      if (subject.minGrade < 10 && subject.maxGrade >= 9) {
        arr.push({ minGrade: 9, maxGrade: 10, id: 3 })
      }
      if (subject.minGrade < 8 && subject.maxGrade >= 5) {
        arr.push({ minGrade: 5, maxGrade: 8, id: 2 })
      }
      if (subject.minGrade > 1 && subject.maxGrade < 4) {
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

  return (
    <VStack space={space['1']}>
      <Heading>{t('course.CourseDate.headline')}</Heading>
      <FormControl>
        <FormControl.Label isRequired>
          {t('course.CourseDate.form.courseNameHeadline')}
        </FormControl.Label>
        <TextArea
          placeholder={t('course.CourseDate.form.courseNamePlaceholder')}
          autoCompleteType={'normal'}
          onChangeText={setCourseName}
        />
      </FormControl>
      <FormControl>
        <FormControl.Label isRequired>
          {t('course.CourseDate.form.courseSubjectLabel')}
        </FormControl.Label>
        <Row>
          {subjects.map(sub => (
            <IconTagList
              initial={subject?.name === sub.name}
              text={sub.name}
              onPress={() =>
                setSubject && setSubject({ ...sub, key: '', label: '' })
              }
            />
          ))}
        </Row>
      </FormControl>

      <FormControl>
        <FormControl.Label isRequired>
          {t('course.CourseDate.form.coursePhotoLabel')}
        </FormControl.Label>
        <Box bg={'primary.100'} w="100" h="100"></Box>
      </FormControl>
      <FormControl>
        <FormControl.Label>
          {t('course.CourseDate.form.courseAddOntherLeadText')}
        </FormControl.Label>
        <Row>
          <Box bg={'primary.900'} w="32px" h="32px"></Box>
          <Text>{t('course.CourseDate.form.courseAddOntherLeadText')}</Text>
        </Row>
      </FormControl>
      <FormControl>
        <FormControl.Label isRequired>
          {t('course.CourseDate.form.shortDescriptionLabel')}
        </FormControl.Label>
        <TextArea
          placeholder={t('course.CourseDate.form.shortDescriptionPlaceholder')}
          autoCompleteType={'normal'}
          onChangeText={setOutline}
        />
        <Text fontSize={'sm'}>
          {t('course.CourseDate.form.shortDescriptionLimitNotice')}
        </Text>
      </FormControl>
      <FormControl>
        <FormControl.Label isRequired>
          {t('course.CourseDate.form.descriptionLabel')}
        </FormControl.Label>
        <TextArea
          placeholder={t('course.CourseDate.form.descriptionPlaceholder')}
          autoCompleteType={'normal'}
          onChangeText={setDescription}
        />
      </FormControl>
      <FormControl>
        <FormControl.Label>
          {t('course.CourseDate.form.tagsLabel')}
        </FormControl.Label>
        <TextArea
          placeholder={t('course.CourseDate.form.tagsLabel')}
          autoCompleteType={'normal'}
          onChangeText={setTags}
        />
        <Text fontSize={'sm'}>{t('course.CourseDate.form.tagsInfo')}</Text>
      </FormControl>
      <Heading>{t('course.CourseDate.form.detailsHeadline')}</Heading>
      <FormControl>
        <FormControl.Label>
          {t('course.CourseDate.form.detailsContent')}
        </FormControl.Label>
        {splitGrades.map((grade: SplitGrade, i) => (
          <ToggleButton
            isActive={courseClasses?.includes(grade?.id) || false}
            dataKey={subject?.key || 'subject'}
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
      <FormControl>
        <FormControl.Label isRequired>
          {t('course.CourseDate.form.maxMembersLabel')}
        </FormControl.Label>
        <TextInput onChangeText={setMaxParticipantCount} />
        <Text fontSize={'sm'}>
          {t('course.CourseDate.form.maxMembersInfo')}
        </Text>
      </FormControl>

      <Heading>{t('course.CourseDate.form.otherHeadline')}</Heading>
      <Row>
        <Text flex="1">{t('course.CourseDate.form.otherOptionStart')}</Text>
        <Switch onValueChange={setJoinAfterStart} />
      </Row>
      <Row>
        <Text flex="1">{t('course.CourseDate.form.otherOptionContact')}</Text>
        <Switch onValueChange={setAllowContact} />
      </Row>
      <Button isDisabled={!isValidInput} onPress={onNext}>
        {t('course.CourseDate.form.button.continue')}
      </Button>
      <Button variant={'outline'} onPress={onCancel}>
        {t('course.CourseDate.form.button.cancel')}
      </Button>
    </VStack>
  )
}
export default CourseData
