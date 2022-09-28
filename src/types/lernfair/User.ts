import { Subject } from './Subject'

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
  subjects: Subject[]
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

export type UserType = string | 'pupil' | 'student'
