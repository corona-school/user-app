import { State } from './State'
import { LFSubject } from './Subject'

export interface User {
  id: string
  firstname: string
  lastname: string
  email: string
  type: 'pupil' | 'student'
  active: boolean
  grade?: number
  matchesRequested?: number
  projectMatchesRequested?: number
  isInstructor?: boolean
  isTutor?: boolean
  isProjectCoachee?: boolean
  isUniversityStudent?: boolean
  isPupil?: boolean
  isParticipant?: boolean
  isProjectCoach?: boolean
  // projectFields?: ProjectInformation[]
  subjects: LFSubject[]
  // matches: Match[]
  // dissolvedMatches: Match[]
  // projectMatches: ProjectMatch[]
  // screeningStatus: ScreeningStatus
  // instructorScreeningStatus: ScreeningStatus
  // projectCoachingScreeningStatus: ScreeningStatus
  state?: string
  university?: string
  schoolType?: string
  lastUpdatedSettingsViaBlocker: number
  registrationDate: number
  // expertData?: ExpertData
  // pupilTutoringInterestConfirmationStatus?: InterestConfirmationStatus
  isOfficial?: boolean
  isCodu?: boolean
}

export type LFUserType = string | 'pupil' | 'student'

export type Pupil = {
  firstname?: string
  lastname?: string
  state?: State
}

export type Participant = {
  firstname: string
  lastname: string
  grade: number
  schooltype: string
}

export type Student = {
  firstname: string
  lastname: string
}
