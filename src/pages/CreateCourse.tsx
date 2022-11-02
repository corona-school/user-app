import { gql, useMutation, useQuery } from '@apollo/client'
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
  VStack
} from 'native-base'
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState
} from 'react'
import { useNavigate } from 'react-router-dom'

import WithNavigation from '../components/WithNavigation'
import { LFSubject } from '../types/lernfair/Subject'

import InstructionProgress from '../widgets/InstructionProgress'

import CourseAppointments from './course-creation/CourseAppointments'
import CourseData from './course-creation/CourseData'
import CoursePreview from './course-creation/CoursePreview'

import { DateTime } from 'luxon'
import { LFLecture } from '../types/lernfair/Course'
import { useTranslation } from 'react-i18next'
import BackButton from '../components/BackButton'
import { Pressable } from 'react-native'
import LFParty from '../assets/icons/lernfair/lf-party.svg'
import useModal from '../hooks/useModal'
import Unsplash from './Unsplash'
import CourseBlocker from './student/CourseBlocker'
import { useMatomo } from '@jonkoops/matomo-tracker-react'

type Props = {}

type Lecture = {
  date: string
  time: string
  duration: string
}

type ICreateCourseContext = {
  courseName?: string
  setCourseName?: Dispatch<SetStateAction<string>>
  subject?: LFSubject
  setSubject?: Dispatch<SetStateAction<LFSubject>>
  courseClasses?: number[]
  setCourseClasses?: Dispatch<SetStateAction<number[]>>
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
  lectures?: Lecture[]
  setLectures?: Dispatch<SetStateAction<Lecture[]>>
  pickedPhoto?: string
}

export const CreateCourseContext = createContext<ICreateCourseContext>({})

const CreateCourse: React.FC<Props> = () => {
  const [courseName, setCourseName] = useState<string>('')
  const [subject, setSubject] = useState<LFSubject>({ name: '' })
  const [courseClasses, setCourseClasses] = useState<number[]>([])
  const [outline, setOutline] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [tags, setTags] = useState<string>('')
  const [maxParticipantCount, setMaxParticipantCount] = useState<string>('')
  const [joinAfterStart, setJoinAfterStart] = useState<boolean>(false)
  const [allowContact, setAllowContact] = useState<boolean>(false)
  const [lectures, setLectures] = useState<Lecture[]>([])
  const [pickedPhoto, setPickedPhoto] = useState<string>('')

  const [fileId, setFileId] = useState<string>('')
  const [currentIndex, setCurrentIndex] = useState<number>(0)

  const { data, loading } = useQuery(gql`
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

  const [
    createCourse,
    { data: courseData, error: courseError, reset: resetCourse }
  ] = useMutation(gql`
    mutation createCourse($course: PublicCourseCreateInput!) {
      courseCreate(course: $course) {
        id
      }
    }
  `)
  const [
    createSubcourse,
    { data: subcourseData, error: subcourseError, reset: resetSubcourse }
  ] = useMutation(gql`
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

  const [setCourseImage, mutImage] = useMutation(gql`
    mutation setCourseImage($courseId: Float!, $fileId: String!) {
      courseSetImage(courseId: $courseId, fileId: $fileId)
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
  }, [])

  const onFinish = useCallback(async () => {
    const course = {
      outline,
      description,
      subject: subject.name,
      schooltype: 'gymnasium', // TODO
      name: courseName,
      category: 'revision',
      allowContact
    }

    await createCourse({
      variables: {
        course
      }
    })
  }, [
    outline,
    description,
    subject.name,
    courseName,
    allowContact,
    createCourse
  ])

  useEffect(() => {
    if (courseData && !courseError) {
      const subcourse: {
        minGrade: number
        maxGrade: number
        maxParticipants: number
        joinAfterStart: boolean
        lectures: LFLecture[]
      } = {
        minGrade: 11,
        maxGrade: 13,
        maxParticipants: parseInt(maxParticipantCount),
        joinAfterStart,
        lectures: []
      }

      for (const lec of lectures) {
        const l: LFLecture = {
          start: new Date().toLocaleString(),
          duration: parseInt(lec.duration)
        }
        const dt = DateTime.fromISO(lec.date)
        const t = DateTime.fromISO(lec.time)

        dt.set({ hour: t.hour, minute: t.minute, second: t.second })
        l.start = dt.toISO()
        subcourse.lectures.push(l)
      }

      createSubcourse({
        variables: {
          courseId: courseData.courseCreate.id,
          subcourse
        }
      })
    }
  }, [
    courseData,
    courseError,
    createSubcourse,
    data?.me?.student?.id,
    joinAfterStart,
    lectures,
    maxParticipantCount
  ])

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

  useEffect(() => {
    if (mutImage.data && !mutImage.error) {
      setShowModal(true)
    } else {
      console.log('error loading up image')
    }
  }, [
    courseData,
    courseError,
    mutImage.data,
    mutImage.error,
    subcourseData,
    subcourseError
  ])

  useEffect(() => {
    if (courseError) {
      resetCourse()
    }
  }, [courseError, resetCourse])

  useEffect(() => {
    if (subcourseError) {
      resetCourse()
      resetSubcourse()
    }
  }, [subcourseError, resetCourse, resetSubcourse])

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

  const uploadPhoto = useCallback(async () => {
    !courseData?.courseCreate?.id &&
      console.log("no course id, can't upload photo")
    if (!courseData?.courseCreate?.id) return

    const formData: FormData = new FormData()

    const base64 = await fetch(pickedPhoto)
    const data = await base64.blob()
    formData.append('file', data, 'img_course.jpeg')

    try {
      // const raw = await fetch(process.env.REACT_APP_UPLOAD_URL, {
      //   method: 'POST',
      //   body: formData
      // })

      if (true) {
        setCourseImage({
          variables: {
            courseId: courseData.courseCreate.id,
            fileId: '1071e47c-8257-4017-bc1e-37dd8219ffae'
          }
        })
        console.log('set photo')
      }
    } catch (e) {
      console.error(e)
    }
  }, [courseData?.courseCreate?.id, pickedPhoto, setCourseImage])

  useEffect(() => {
    if (courseData && !courseError) {
      uploadPhoto()
    }
  }, [
    courseData,
    courseError,
    fileId,
    subcourseData,
    subcourseError,
    uploadPhoto
  ])

  const ContainerWidth = useBreakpointValue({
    base: '100%',
    lg: sizes['containerWidth']
  })

  const ContentContainerWidth = useBreakpointValue({
    base: '100%',
    lg: sizes['contentContainerWidth']
  })

  if (loading) return <></>

  return (
    <WithNavigation headerTitle={t('course.header')} showBack>
      <CreateCourseContext.Provider
        value={{
          courseName,
          setCourseName,
          courseClasses,
          setCourseClasses,
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
          pickedPhoto
        }}>
        {(data?.me?.student?.canCreateCourse?.allowed && (
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
              />
            )}
            {currentIndex === 1 && (
              <CourseAppointments onNext={onNext} onBack={onBack} />
            )}
            {currentIndex === 2 && (
              <>
                <CoursePreview
                  onNext={onNext}
                  onBack={onBack}
                  isDisabled={loading}
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
