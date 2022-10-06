import { LFDecision } from './Decision'
import { Pupil } from './User'

export type LFCourse = {
  name: string
  description: string
  outline: string
  tags?: LFTag[]
}
export interface LFSubCourse extends LFCourse {
  id?: number
  lectures: LFLecture[]
  image?: string
  participants?: Pupil[]
  participantsAsPupil?: Pupil[]
  maxParticipants?: number
  participantsCount?: number
  course: LFCourse
  canJoin?: LFDecision
  isOnWaitingList?: boolean
}

export type LFLecture = {
  id?: number
  start: Date
  duration: number
}

export type LFTag = {
  name: string
  category?: string
}
