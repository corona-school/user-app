import { gql, useMutation, useQuery } from '@apollo/client'
import { useTheme, VStack } from 'native-base'
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
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
}

export const CreateCourseContext = createContext<ICreateCourseContext>({})

const CreateCourse: React.FC<Props> = () => {
  const [courseName, setCourseName] = useState<string>('')
  const [subject, setSubject] = useState<LFSubject>({ name: '' })
  const [courseClasses, setCourseClasses] = useState<number[]>([])
  const [outline, setOutline] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [tags, setTags] = useState<string>('')
  const [maxParticipantCount, setMaxParticipantCount] = useState<string>('0')
  const [joinAfterStart, setJoinAfterStart] = useState<boolean>(false)
  const [allowContact, setAllowContact] = useState<boolean>(false)
  const [lectures, setLectures] = useState<Lecture[]>([])

  const [currentIndex, setCurrentIndex] = useState<number>(0)

  const { data, error, loading } = useQuery(gql`
    query {
      me {
        student {
          id
        }
      }
    }
  `)

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
  const [
    createCourse,
    { data: courseData, error: courseError, loading: courseLoading }
  ] = useMutation(gql`
    mutation createCourse(
      $studentId: Float!
      $course: PublicCourseCreateInput!
      $subcourse: PublicSubcourseCreateInput!
    ) {
      courseCreate(studentId: $studentId, course: $course) {
        id
      }
      subcourseCreate(
        studentId: $studentId
        courseId: id
        subcourse: $subcourse
      )
    }
  `)

  const { space } = useTheme()
  const navigate = useNavigate()

  const onFinish = useCallback(() => {
    // TODO unsplash

    const course = {
      outline,
      description,
      subject: subject.name,
      schooltype: 'gymnasium', // TODO
      name: courseName,
      category: 'club', // TODO
      allowContact
    }

    const subcourse: {
      minGrade: number
      maxGrade: number
      maxParticipants: number
      joinAfterStart: boolean
      lecture: LFLecture[]
    } = {
      minGrade: 0,
      maxGrade: 0,
      maxParticipants: parseInt(maxParticipantCount),
      joinAfterStart,
      lecture: []
    }

    for (const lec of lectures) {
      const l: LFLecture = {
        start: new Date(),
        duration: parseInt(lec.duration)
      }
      const dt = DateTime.fromISO(lec.date)
      const t = DateTime.fromISO(lec.time)
      dt.set({ hour: t.hour, minute: t.minute, second: t.second })
      subcourse.lecture.push(l)
    }

    createCourse({
      variables: {
        studentId: data?.me?.student?.id,
        course,
        subcourse
      }
    })
  }, [
    outline,
    description,
    subject.name,
    courseName,
    allowContact,
    maxParticipantCount,
    joinAfterStart,
    createCourse,
    data?.me?.student?.id,
    lectures
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
                label: 'Kurs'
              },
              {
                label: 'Termine'
              },
              {
                label: 'Angaben prüfen'
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
