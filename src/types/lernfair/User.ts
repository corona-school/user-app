import { AppointmentParticipant, Organizer } from '../../gql/graphql';
import { State } from './State';

export enum UserType {
    STUDENT = 'student',
    PUPIL = 'pupil',
}

// c.f. https://github.com/corona-school/backend/blob/master/common/user/roles.ts
// This list only includes the subset of roles that make sense to use in the frontend
export type Role =
    | 'USER'
    | 'SCREENER'
    | 'TRUSTED_SCREENER'
    | 'COURSE_SCREENER'
    | 'PUPIL_SCREENER'
    | 'STUDENT_SCREENER'
    | 'PUPIL'
    | 'STUDENT'
    | 'WANNABE_TUTOR'
    | 'TUTOR'
    | 'WANNABE_INSTRUCTOR'
    | 'INSTRUCTOR'
    | 'TUTEE'
    | 'PARTICIPANT'
    | 'SUBCOURSE_PARTICIPANT'
    | 'SSO_REGISTERING_USER';

export const ERole = {
    USER: 'USER' as const,
    SCREENER: 'SCREENER' as const,
    TRUSTED_SCREENER: 'TRUSTED_SCREENER' as const,
    COURSE_SCREENER: 'COURSE_SCREENER' as const,
    PUPIL_SCREENER: 'PUPIL_SCREENER' as const,
    STUDENT_SCREENER: 'STUDENT_SCREENER' as const,
    PUPIL: 'PUPIL' as const,
    STUDENT: 'STUDENT' as const,
    WANNABE_TUTOR: 'WANNABE_TUTOR' as const,
    TUTOR: 'TUTOR' as const,
    WANNABE_INSTRUCTOR: 'WANNABE_INSTRUCTOR' as const,
    INSTRUCTOR: 'INSTRUCTOR' as const,
    TUTEE: 'TUTEE' as const,
    PARTICIPANT: 'PARTICIPANT' as const,
    SUBCOURSE_PARTICIPANT: 'SUBCOURSE_PARTICIPANT' as const,
};

export const SCREENED_HELPER_ROLES: Role[] = ['INSTRUCTOR', 'TUTOR'];

export type LFUserType = string | 'pupil' | 'student';

export type LFPupil = {
    id?: string;
    firstname?: string;
    lastname?: string;
    state?: State;
};

export type LFStudent = {
    firstname: string;
    lastname: string;
};

export type Attendee = AppointmentParticipant | Organizer;
