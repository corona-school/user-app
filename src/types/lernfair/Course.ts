import { LFDecision } from './Decision'
import { Pupil } from './User'

export type LFCourse = {
  subject: string
  id?: string
  name: string
  description: string
  outline: string
  tags?: LFTag[]
  image?: string
  allowContact?: boolean
}
export interface LFSubCourse {
  id?: string
  lectures: LFLecture[]
  image?: string
  isParticipant?: boolean
  participants?: Pupil[]
  participantsAsPupil?: Pupil[]
  maxParticipants?: number
  participantsCount?: number
  course: LFCourse
  canJoin?: LFDecision
  isOnWaitingList?: boolean
  published?: boolean
  joinAfterStart?: boolean
  instructors?: LFInstructor[]
  firstLecture?: LFLecture
  minGrade?: number
  maxGrade?: number
}

export type LFLecture = {
  id?: number
  start: string
  duration: number | string
}

export type LFTag = {
  name: string
  category?: string
}

export type LFInstructor = {
  id?: string
  firstname: string
  lastname: string
}

export type TrafficStatus = 'full' | 'last' | 'free'
