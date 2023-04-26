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
export const SCREENED_HELPER_ROLES = ['INSTRUCTOR', 'TUTOR'];

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
