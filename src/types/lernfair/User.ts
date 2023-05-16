import { AppointmentParticipant, Organizer } from '../../gql/graphql';
import { State } from './State';

export enum UserType {
    STUDENT = 'student',
    PUPIL = 'pupil',
}

export enum AttendanceStatus {
    ACCEPTED = 'accepted',
    DECLINED = 'declined',
}
// c.f. https://github.com/corona-school/backend/blob/master/common/user/roles.ts
// This list only includes the subset of roles that make sense to use in the frontend
export type Role =
    | 'USER'
    | 'SCREENER'
    | 'PUPIL'
    | 'STUDENT'
    | 'WANNABE_TUTOR'
    | 'TUTOR'
    | 'WANNABE_INSTRUCTOR'
    | 'INSTRUCTOR'
    | 'TUTEE'
    | 'PARTICIPANT'
    | 'SUBCOURSE_PARTICIPANT';

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
