import { State } from './State';

export enum UserType {
    STUDENT = 'student',
    PUPIL = 'pupil',
}

export enum AttendanceStatus {
    ACCEPTED = 'accepted',
    DECLINED = 'declined',
}

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

export interface Attendee {
    appointmentId: number;
    status: AttendanceStatus;
    declined: boolean;
}

export interface ParticipantPupil extends Attendee {
    pupilId: number;
    firstname: string;
    lastname: string;
    isPupil: true;
}

export interface ParticipantStudent extends Attendee {
    studentId: number;
    firstname: string;
    lastname: string;
    isStudent: true;
}

export interface ParticipantScreener extends Attendee {
    screenerId: number;
    firstname: string;
    lastname: string;
}

export interface Organizer extends Attendee {
    studentId: number;
    firstname: string;
    lastname: string;
    isStudent: true;
}

export type Participant = ParticipantPupil | ParticipantStudent;
