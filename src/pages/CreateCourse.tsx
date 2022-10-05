import { gql, useMutation } from '@apollo/client'
import { useTheme, VStack } from 'native-base'
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
import { Subject } from '../types/lernfair/Subject'

import InstructionProgress from '../widgets/InstructionProgress'

import CourseAppointments from './course-creation/CourseAppointments'
import CourseData from './course-creation/CourseData'
import CoursePreview from './course-creation/CoursePreview'

import { DateTime } from 'luxon'

type Props = {}

type Lecture = {
  date: any
  time: any
  duration: any
}

type ICreateCourseContext = {
  courseName?: string
  setCourseName?: Dispatch<SetStateAction<string>>
  subject?: Subject
  setSubject?: Dispatch<SetStateAction<Subject>>
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
}

export const CreateCourseContext = createContext<ICreateCourseContext>({})

const CreateCourse: React.FC<Props> = () => {
  const [courseName, setCourseName] = useState<string>('')
  const [subject, setSubject] = useState<Subject>({ key: '', label: '' })
  const [courseClasses, setCourseClasses] = useState<number[]>([])
  const [outline, setOutline] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [tags, setTags] = useState<string>('')
  const [maxParticipantCount, setMaxParticipantCount] = useState<string>('0')
  const [joinAfterStart, setJoinAfterStart] = useState<boolean>(false)
  const [allowContact, setAllowContact] = useState<boolean>(false)
  const [lectures, setLectures] = useState<Lecture[]>([])

  const [currentIndex, setCurrentIndex] = useState<number>(0)

  // TODO just put in to satisfy graphql errors
  // mutation createCourse(
  //   $user: Float!
  //   $course: PublicCourseCreateInput!
  //   $sub: PublicSubcourseCreateInput!
  //   $lec: [PublicLectureInput!]
  // ) {
  //   courseCreate(studentId: $user, course: $course) {
  //     id
  //   }
  //   subcourseCreate(courseId: id, subcourse: $sub}){id}
  //   lectureCreate(subcourseId: id, lecture: $lec)
  // }
  const [createCourse, { data, error, loading }] = useMutation(gql`
    mutation createCourse($course: PublicCourseCreateInput!) {
      courseCreate(course: $course)
    }
  `)

  const { space } = useTheme()
  const navigate = useNavigate()

  const onFinish = useCallback(() => {
    // TODO collect all data
    // TODO format lectures correctly
    // TODO unsplash
    createCourse({ variables: {} })
  }, [createCourse])

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
    if (data) {
    }
  }, [data])

  return (
    <WithNavigation>
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
          setLectures
        }}>
        <VStack space={space['1']} padding={space['1']}>
          <InstructionProgress
            currentIndex={currentIndex}
            instructions={[
              {
                label: 'Kurs',
                content: []
              },
              {
                label: 'Termine',
                content: []
              },
              {
                label: 'Angaben prüfen',
                content: []
              }
            ]}
          />
          {currentIndex === 0 && (
            <CourseData onNext={onNext} onCancel={onCancel} />
          )}
          {currentIndex === 1 && (
            <CourseAppointments onNext={onNext} onBack={onBack} />
          )}
          {currentIndex === 2 && (
            <CoursePreview
              onNext={onNext}
              onBack={onBack}
              isDisabled={loading}
            />
          )}
        </VStack>
      </CreateCourseContext.Provider>
    </WithNavigation>
  )
}
export default CreateCourse
