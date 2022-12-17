import { LFSubject } from './Subject'
import { LFPupil, LFStudent } from './User'

export type LFMatch = {
  id: number
  dissolved: boolean
  pupil: any
  student: any
  subjectsFormatted: LFSubject[]
}
