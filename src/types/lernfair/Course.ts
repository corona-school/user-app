import { LFDecision } from './Decision'
import { Pupil } from './User'

export type LFCourse = {
  id?: string
  name: string
  description: string
  outline: string
  tags?: LFTag[]
  image?: string
}
export interface LFSubCourse extends LFCourse {
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
}

export type LFLecture = {
  id?: number
  start: string
  duration: number
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
