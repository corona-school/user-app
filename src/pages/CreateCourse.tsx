import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client'
import {
  Box,
  Button,
  CloseIcon,
  Heading,
  Modal,
  Row,
  Text,
  useBreakpointValue,
  useTheme,
  useToast,
  VStack
} from 'native-base'
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import WithNavigation from '../components/WithNavigation'
import { LFSubject } from '../types/lernfair/Subject'

import InstructionProgress from '../widgets/InstructionProgress'

import CourseAppointments from './course-creation/CourseAppointments'
import CourseData from './course-creation/CourseData'
import CoursePreview from './course-creation/CoursePreview'

import { DateTime } from 'luxon'
import {
  LFInstructor,
  LFLecture,
  LFSubCourse,
  LFTag
} from '../types/lernfair/Course'
import { useTranslation } from 'react-i18next'
import { Pressable } from 'react-native'
import LFParty from '../assets/icons/lernfair/lf-party.svg'
import useModal from '../hooks/useModal'
import Unsplash from '../modals/Unsplash'
import CourseBlocker from './student/CourseBlocker'
import { useMatomo } from '@jonkoops/matomo-tracker-react'
import AddCourseInstructor from '../modals/AddCourseInstructor'
import { GraphQLError } from 'graphql'

type Props = {}

export type Lecture = {
  id?: string | number
  date: string
  time: string
  duration: string
}

type ICreateCourseContext = {
  courseName?: string
  setCourseName?: Dispatch<SetStateAction<string>>
  subject?: LFSubject
  setSubject?: Dispatch<SetStateAction<LFSubject>>
  classRange?: [number, number]
  setClassRange?: Dispatch<SetStateAction<[number, number]>>
  outline?: string
  setOutline?: Dispatch<SetStateAction<string>>
  description?: string
  setDescription?: Dispatch<SetStateAction<string>>
  tags?: string
  setTags?: Dispatch<SetStateAction<string>>
  maxParticipantCount?: string
  setMaxParticipantCount?: Dispatch<SetStateAction<string>>
  joinAfterStart?: boolean
  setJoinAfterStart?: Dispatch<SetStateAction<boolean>>
  allowContact?: boolean
  setAllowContact?: Dispatch<SetStateAction<boolean>>
  lectures?: LFLecture[]
  setLectures?: Dispatch<SetStateAction<LFLecture[]>>
  newLectures?: Lecture[]
  setNewLectures?: Dispatch<SetStateAction<Lecture[]>>
  pickedPhoto?: string
  setPickedPhoto?: Dispatch<SetStateAction<string>>
  addedInstructors?: LFInstructor[]
  setAddedInstructors?: Dispatch<SetStateAction<LFInstructor[]>>
  newInstructors?: LFInstructor[]
}

export const CreateCourseContext = createContext<ICreateCourseContext>({})

const CreateCourse: React.FC<Props> = () => {
  const toast = useToast()

  const location = useLocation()
  const state = location.state as { courseId?: number }
  const prefillCourseId = state.courseId

  const [courseId, setCourseId] = useState<string>('')
  const [courseName, setCourseName] = useState<string>('')
  const [subject, setSubject] = useState<LFSubject>({ name: '' })
  const [courseClasses, setCourseClasses] = useState<[number, number]>([1, 13])
  const [outline, setOutline] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [tags, setTags] = useState<string>('')
  const [maxParticipantCount, setMaxParticipantCount] = useState<string>('')
  const [joinAfterStart, setJoinAfterStart] = useState<boolean>(false)
  const [allowContact, setAllowContact] = useState<boolean>(false)
  const [lectures, setLectures] = useState<LFLecture[]>([])
  const [newLectures, setNewLectures] = useState<Lecture[]>([])
  const [pickedPhoto, setPickedPhoto] = useState<string>('')
  const [addedInstructors, setAddedInstructors] = useState<LFInstructor[]>([])
  const [newInstructors, setNewInstructors] = useState<LFInstructor[]>([])

  const [isLoading, setIsLoading] = useState<boolean>()
  const [showCourseError, setShowCourseError] = useState<boolean>()

  const [imageLoading, setImageLoading] = useState<boolean>(false)

  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const isEditing = useMemo(() => !!prefillCourseId, [prefillCourseId])

  const { data: studentData, loading } = useQuery(gql`
    query {
      me {
        student {
          canCreateCourse {
            allowed
            reason
          }
          id
        }
      }
    }
  `)

  const [courseQuery] = useLazyQuery(gql`
    query ($id: Int!) {
      subcourse(subcourseId: $id) {
        id
        participantsCount
        maxParticipants
        instructors {
          id
          firstname
          lastname
        }
        joinAfterStart

        course {
          id
          name
          image
          outline
          category
          description
          subject
          allowContact
          tags {
            name
          }
        }
        lectures {
          id
          start
          duration
        }
      }
    }
  `)

  const [createCourse, { reset: resetCourse }] = useMutation(gql`
    mutation createCourse($course: PublicCourseCreateInput!) {
      courseCreate(course: $course) {
        id
      }
    }
  `)
  const [updateCourse, { reset: resetEditCourse }] = useMutation(gql`
    mutation updateCourse($course: PublicCourseEditInput!, $id: Float!) {
      courseEdit(course: $course, courseId: $id) {
        id
      }
    }
  `)
  const [createSubcourse, { reset: resetSubcourse }] = useMutation(gql`
    mutation createSubcourse(
      $courseId: Float!
      $subcourse: PublicSubcourseCreateInput!
    ) {
      subcourseCreate(courseId: $courseId, subcourse: $subcourse) {
        id
        canPublish {
          allowed
          reason
        }
      }
    }
  `)
  const [updateSubcourse, { reset: resetEditSubcourse }] = useMutation(gql`
    mutation updateSubcourse($course: PublicSubcourseEditInput!, $id: Float!) {
      subcourseEdit(subcourse: $course, subcourseId: $id) {
        id
      }
    }
  `)

  const [setCourseImage] = useMutation(gql`
    mutation setCourseImage($courseId: Float!, $fileId: String!) {
      courseSetImage(courseId: $courseId, fileId: $fileId)
    }
  `)

  const [addCourseInstructor] = useMutation(gql`
    mutation addCourseInstructor($studentId: Float!, $courseId: Float!) {
      subcourseAddInstructor(studentId: $studentId, subcourseId: $courseId)
    }
  `)
  const [removeCourseInstructor] = useMutation(gql`
    mutation removeCourseInstructor($studentId: Float!, $courseId: Float!) {
      subcourseDeleteInstructor(studentId: $studentId, subcourseId: $courseId)
    }
  `)
  const [addLecture] = useMutation(gql`
    mutation addLecture($lecture: PublicLectureInput!, $courseId: Float!) {
      lectureCreate(lecture: $lecture, subcourseId: $courseId) {
        id
      }
    }
  `)

  const [removeLecture] = useMutation(gql`
    mutation removeLecture($lectureId: Float!) {
      lectureDelete(lectureId: $lectureId)
    }
  `)

  const { space, sizes } = useTheme()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [showModal, setShowModal] = useState(false)
  const { setShow, setContent } = useModal()
  const { trackPageView } = useMatomo()

  useEffect(() => {
    trackPageView({
      documentTitle: 'Kurs erstellen'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const ContentContainerWidth = useBreakpointValue({
    base: '100%',
    lg: sizes['contentContainerWidth']
  })

  const queryCourse = useCallback(async () => {
    setIsLoading(true)
    const {
      data: { subcourse: prefillCourse }
    } = (await courseQuery({
      variables: { id: prefillCourseId }
    })) as { data: { subcourse: LFSubCourse } }

    setCourseId(prefillCourse.course.id || '')
    setCourseName(prefillCourse.course.name)
    setSubject({ name: prefillCourse.course.subject })
    setOutline(prefillCourse.course.outline)
    setDescription(prefillCourse.course.description)
    setMaxParticipantCount(prefillCourse.maxParticipants?.toString() || '0')
    setJoinAfterStart(!!prefillCourse.joinAfterStart)
    setAllowContact(!!prefillCourse.course.allowContact)

    if (prefillCourse.instructors && Array.isArray(prefillCourse.instructors)) {
      setAddedInstructors(prefillCourse.instructors)
    }

    if (prefillCourse.course.tags && Array.isArray(prefillCourse.course.tags)) {
      setTags(prefillCourse.course.tags.map((t: LFTag) => t.name).join(', '))
    }

    if (prefillCourse.lectures && Array.isArray(prefillCourse.lectures)) {
      // typing is not that nice here
      const editLectures: any[] = prefillCourse.lectures.map(
        (l: LFLecture) => ({
          ...l,
          duration: l.duration,
          date: DateTime.fromISO(l.start).toFormat('yyyy-MM-dd'),
          time: DateTime.fromISO(l.start).toFormat('HH:mm')
        })
      )
      setLectures(editLectures)
    }

    // TODO
    // setCourseClasses([prefillCourse.])
    //TODo
    // const [pickedPhoto, setPickedPhoto] = useState<string>('')

    setIsLoading(false)
  }, [courseQuery, prefillCourseId])

  useEffect(() => {
    if (prefillCourseId !== null) queryCourse()
  }, [prefillCourseId, queryCourse])

  const finishCourseCreation = useCallback(
    (errors: any[]) => {
      setIsLoading(false)

      if (errors.includes('course') || errors.includes('subcourse')) {
        setShowCourseError(true)
      } else {
        navigate('/group', {
          state: {
            errors
          }
        })
      }
    },
    [navigate]
  )

  const _getCourseData = useCallback(
    () => ({
      outline,
      description,
      subject: subject.name,
      schooltype: studentData?.me?.student?.schooltype || 'other',
      name: courseName,
      category: 'revision',
      allowContact
    }),
    [
      allowContact,
      courseName,
      description,
      outline,
      studentData?.me?.student?.schooltype,
      subject.name
    ]
  )

  const _getSubcourseData = useCallback(() => {
    const subcourse: {
      minGrade: number
      maxGrade: number
      maxParticipants: number
      joinAfterStart: boolean
    } = {
      minGrade: courseClasses[0],
      maxGrade: courseClasses[1],
      maxParticipants: parseInt(maxParticipantCount),
      joinAfterStart
    }

    return subcourse
  }, [courseClasses, joinAfterStart, maxParticipantCount])

  const submitCourse = useCallback(async () => {
    setIsLoading(true)

    const errors = []

    /**
     * Course Creation
     */
    const course = _getCourseData()
    const courseData = (await createCourse({
      variables: {
        course
      }
    })) as { data: { courseCreate?: { id: number } }; errors?: GraphQLError[] }

    if (!courseData.data && courseData.errors) {
      errors.push('course')
      await resetCourse()
      finishCourseCreation(errors)
      return
    }

    const courseId = courseData?.data?.courseCreate?.id

    if (!courseId) {
      errors.push('course')
      await resetCourse()
      finishCourseCreation(errors)
      setIsLoading(false)
      return
    }

    /**
     * Subcourse Creation
     */
    const subcourse = _getSubcourseData()

    const subRes = await createSubcourse({
      variables: {
        courseId: courseId,
        subcourse
      }
    })

    if (!subRes.data && subRes.errors) {
      errors.push('subcourse')
      await resetSubcourse()
      await resetCourse()
      finishCourseCreation(errors)
      setIsLoading(false)
      return
    }

    if (subRes.data.subcourseCreate && !subRes.errors) {
      for await (const instructor of addedInstructors) {
        let res = await addCourseInstructor({
          variables: {
            courseId: subRes.data?.subcourseCreate?.id,
            studentId: instructor.id
          }
        })
        if (!res.data && res.errors) {
          errors.push('subcourse')
          finishCourseCreation(errors)
          setIsLoading(false)
          return
        }
      }
    }

    /**
     * Image upload
     */
    if (!pickedPhoto) {
      errors.push('missing_image')
      finishCourseCreation(errors)
      return
    }
    setImageLoading(true)
    const formData: FormData = new FormData()

    const base64 = pickedPhoto
      ? await fetch(pickedPhoto)
      : require('../assets/images/globals/image-placeholder.png')
    const data = await base64.blob()
    formData.append('file', data, 'img_course.jpeg')

    let uploadFileId
    try {
      uploadFileId = await fetch(process.env.REACT_APP_UPLOAD_URL, {
        method: 'POST',
        body: formData
      })

      if (!uploadFileId) {
        errors.push('upload_image')
      }
    } catch (e) {
      console.error(e)
      errors.push('upload_image')
    }

    if (!uploadFileId) {
      finishCourseCreation(errors)
      return
    }

    /**
     * Set image in course
     */
    const imageRes = (await setCourseImage({
      variables: {
        courseId: courseId,
        fileId: uploadFileId
      }
    })) as { data?: { setCourseImage: boolean }; errors?: GraphQLError[] }

    if (!imageRes.data && imageRes.errors) {
      errors.push('set_image')
    }

    setImageLoading(false)

    finishCourseCreation(errors)
  }, [
    _getCourseData,
    _getSubcourseData,
    addCourseInstructor,
    addedInstructors,
    createCourse,
    createSubcourse,
    finishCourseCreation,
    pickedPhoto,
    resetCourse,
    resetSubcourse,
    setCourseImage
  ])

  const editCourse = useCallback(async () => {
    setIsLoading(true)
    const errors: string[] = []

    const course = _getCourseData()
    const courseData = (await updateCourse({
      variables: {
        course,
        id: courseId
      }
    })) as { data: { courseEdit?: { id: number } }; errors?: GraphQLError[] }

    if (!courseData.data && courseData.errors) {
      errors.push('course')
      await resetEditCourse()
      finishCourseCreation(errors)
      return
    }

    const _courseId = courseData?.data?.courseEdit?.id

    if (!_courseId) {
      errors.push('course')
      await resetEditCourse()
      finishCourseCreation(errors)
      setIsLoading(false)
      return
    }

    const subcourse = _getSubcourseData()
    const subRes = await updateSubcourse({
      variables: {
        id: prefillCourseId,
        course: subcourse
      }
    })

    if (!subRes.data && subRes.errors) {
      errors.push('subcourse')
      await resetEditSubcourse()
      await resetEditCourse()
      finishCourseCreation(errors)
      setIsLoading(false)
      return
    }

    for await (const instructor of newInstructors) {
      let res = await addCourseInstructor({
        variables: {
          courseId: prefillCourseId,
          studentId: instructor.id
        }
      })
      if (!res.data && res.errors) {
        errors.push('instructors')
      }
    }

    for await (const lecture of newLectures) {
      const l: LFLecture = {
        start: new Date().toLocaleString(),
        duration: parseInt(lecture.duration)
      }
      const dt = DateTime.fromISO(lecture.date)
      const t = DateTime.fromISO(lecture.time)

      dt.set({ hour: t.hour, minute: t.minute, second: t.second })
      l.start = dt.toISO()

      let res = await addLecture({
        variables: {
          courseId: prefillCourseId,
          lecture: l
        }
      })
      if (!res.data.lectureDelete && res.errors) {
        errors.push('lectures')
      }
    }

    /**
     * Image upload
     */
    if (!pickedPhoto) {
      setIsLoading(false)
      finishCourseCreation(errors)
      return
    }
    setImageLoading(true)
    const formData: FormData = new FormData()

    const base64 = await fetch(pickedPhoto)

    const data = await base64.blob()
    formData.append('file', data, 'img_course.jpeg')

    let uploadFileId
    try {
      uploadFileId = await fetch(process.env.REACT_APP_UPLOAD_URL, {
        method: 'POST',
        body: formData
      })

      if (!uploadFileId) {
        errors.push('upload_image')
      }
    } catch (e) {
      console.error(e)
      errors.push('upload_image')
    }

    if (!uploadFileId) {
      finishCourseCreation(errors)
      return
    }

    /**
     * Set image in course
     */
    const imageRes = (await setCourseImage({
      variables: {
        courseId: courseId,
        fileId: uploadFileId
      }
    })) as { data?: { setCourseImage: boolean }; errors?: GraphQLError[] }

    if (!imageRes.data && imageRes.errors) {
      errors.push('set_image')
    }

    setImageLoading(false)
    finishCourseCreation(errors)
  }, [
    _getCourseData,
    updateCourse,
    courseId,
    _getSubcourseData,
    updateSubcourse,
    prefillCourseId,
    pickedPhoto,
    setCourseImage,
    finishCourseCreation,
    resetEditCourse,
    resetEditSubcourse,
    newInstructors,
    addCourseInstructor,
    newLectures,
    addLecture
  ])

  const onFinish = useCallback(async () => {
    if (isEditing) {
      editCourse()
    } else {
      submitCourse()
    }
  }, [isEditing, editCourse, submitCourse])

  const onNext = useCallback(() => {
    if (currentIndex >= 2) {
      onFinish()
    } else {
      setCurrentIndex(prev => prev + 1)
    }
  }, [currentIndex, onFinish])

  const onBack = useCallback(() => {
    setCurrentIndex(prev => prev - 1)
  }, [])

  const onCancel = useCallback(() => {
    navigate(-1)
  }, [navigate])

  const pickPhoto = useCallback(
    (photo: string) => {
      setPickedPhoto(photo)
      setShow(false)
      setContent(<></>)
    },
    [setContent, setShow]
  )

  const showUnsplash = useCallback(() => {
    setContent(
      <Unsplash
        onPhotoSelected={pickPhoto}
        onClose={() => {
          setShow(false)
          setContent(<></>)
        }}
      />
    )
    setShow(true)
  }, [pickPhoto, setContent, setShow])

  const addInstructor = useCallback(
    (instructor: LFInstructor) => {
      if (prefillCourseId === null) {
        if (addedInstructors.findIndex(i => i.id === instructor.id) === -1) {
          setAddedInstructors(prev => [...prev, instructor])
        }
      } else {
        if (newInstructors.findIndex(i => i.id === instructor.id) === -1) {
          setNewInstructors(prev => [...prev, instructor])
        }
      }
      setShow(false)
      setContent(<></>)
    },
    [addedInstructors, newInstructors, prefillCourseId, setContent, setShow]
  )

  const showAddInstructor = useCallback(() => {
    setContent(
      <AddCourseInstructor
        addedInstructors={addedInstructors}
        onInstructorAdded={addInstructor}
        onClose={() => {
          setShow(false)
          setContent(<></>)
        }}
      />
    )
    setShow(true)
  }, [addInstructor, setContent, setShow, addedInstructors])

  const removeInstructor = useCallback(
    async (index: number, isSubmitted: boolean) => {
      if (!isSubmitted) {
        const arr = [...newInstructors]
        arr.splice(index, 1)
        setNewInstructors(arr)
      } else {
        const res = await removeCourseInstructor({
          variables: {
            courseId: prefillCourseId,
            studentId: addedInstructors[index].id
          }
        })

        if (res.data.subcourseDeleteInstructor && !res.errors) {
          const arr = [...addedInstructors]
          arr.splice(index, 1)
          setAddedInstructors(arr)
          toast.show({ description: 'Der/Die Kursleiter:in wurde entfernt.' })
        } else {
          toast.show({
            description: 'Der/Die Kursleiter:in konnte nicht entfernt werden.'
          })
        }
      }
    },
    [
      addedInstructors,
      newInstructors,
      prefillCourseId,
      removeCourseInstructor,
      toast
    ]
  )

  const deleteAppointment = useCallback(
    async (index: number, isSubmitted: boolean) => {
      if (!isSubmitted) {
        const arr = [...newLectures]
        arr.splice(index, 1)
        setNewLectures(arr)
      } else {
        const lecs = [...lectures]
        const res = await removeLecture({
          variables: {
            lectureId: lecs[index].id
          }
        })
        if (res.data.lectureDelete && !res.errors) {
          lecs.splice(index, 1)
          setLectures(lecs)
          toast.show({ description: 'Der Termin wurde entfernt.' })
        } else {
          toast.show({
            description: 'Der Termin konnte nicht entfernt werden.'
          })
        }
      }
    },
    [lectures, newLectures, removeLecture, toast]
  )

  return (
    <WithNavigation
      headerTitle={isEditing ? 'Kurs bearbeiten' : t('course.header')}
      showBack
      isLoading={loading || isLoading}>
      <CreateCourseContext.Provider
        value={{
          courseName,
          setCourseName,
          classRange: courseClasses,
          setClassRange: setCourseClasses,
          subject,
          setSubject,
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
          lectures,
          setLectures,
          newLectures,
          setNewLectures,
          pickedPhoto,
          setPickedPhoto,
          addedInstructors,
          newInstructors
        }}>
        {(studentData?.me?.student?.canCreateCourse?.allowed && (
          <VStack
            space={space['1']}
            padding={space['1']}
            marginX="auto"
            width="100%"
            maxWidth={ContentContainerWidth}>
            <InstructionProgress
              isDark={false}
              currentIndex={currentIndex}
              instructions={[
                {
                  label: t('course.CourseDate.tabs.course')
                },
                {
                  label: t('course.CourseDate.tabs.appointments')
                },
                {
                  label: t('course.CourseDate.tabs.checker')
                }
              ]}
            />
            {currentIndex === 0 && (
              <CourseData
                onNext={onNext}
                onCancel={onCancel}
                onShowUnsplash={showUnsplash}
                onShowAddInstructor={showAddInstructor}
                onRemoveInstructor={removeInstructor}
              />
            )}
            {currentIndex === 1 && (
              <CourseAppointments
                onNext={onNext}
                onBack={onBack}
                onDeleteAppointment={deleteAppointment}
              />
            )}
            {currentIndex === 2 && (
              <>
                <CoursePreview
                  onNext={onNext}
                  onBack={onBack}
                  isError={showCourseError}
                  isDisabled={loading || isLoading || imageLoading}
                  prefillCourseId={prefillCourseId}
                />
                <Modal
                  isOpen={showModal}
                  onClose={() => setShowModal(false)}
                  background="modalbg">
                  <Modal.Content
                    width="307px"
                    marginX="auto"
                    backgroundColor="transparent">
                    <Box position="absolute" zIndex="1" right="20px" top="14px">
                      <Pressable onPress={() => setShowModal(false)}>
                        <CloseIcon color="white" />
                      </Pressable>
                    </Box>
                    <Modal.Body background="primary.900" padding={space['1']}>
                      <Box alignItems="center" marginY={space['1']}>
                        <LFParty />
                      </Box>
                      <Box paddingY={space['1']}>
                        <Heading
                          maxWidth="330px"
                          marginX="auto"
                          textAlign="center"
                          color="lightText"
                          marginBottom={space['0.5']}>
                          {t('course.modal.headline')}
                        </Heading>
                        <Text
                          textAlign="center"
                          color="lightText"
                          maxWidth="330px"
                          marginX="auto">
                          {t('course.modal.content')}
                        </Text>
                      </Box>
                      <Box paddingY={space['1']}>
                        <Row marginBottom={space['0.5']}>
                          <Button onPress={() => navigate('/')} width="100%">
                            {t('course.modal.button')}
                          </Button>
                        </Row>
                      </Box>
                    </Modal.Body>
                  </Modal.Content>
                </Modal>
              </>
            )}
          </VStack>
        )) || <CourseBlocker />}
      </CreateCourseContext.Provider>
    </WithNavigation>
  )
}
export default CreateCourse
