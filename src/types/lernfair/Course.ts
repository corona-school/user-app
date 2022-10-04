import { Pupil } from './User'

export type LFCourse = {
  name: string
  description: string
  outline: string
}

export interface LFSubCourse extends LFCourse {
  id?: number
  lectures: LFLecture[]
  image?: string
  participants?: Pupil[]
  maxParticipants?: number
  participantCount?: number
  course: LFCourse
}

export type LFLecture = {
  id?: number
  start: Date
  duration: number
}
