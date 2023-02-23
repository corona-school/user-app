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

export type Student = {
    id: number;
    firstname: string;
    lastname: string;
    isStudent: true;
};

export type Pupil = {
    id: number;
    firstname: string;
    lastname: string;
    isPupil: true;
};

export type Screener = {
    id: number;
    firstname: string;
    lastname: string;
    isScreener: true;
};

export type Organizer = {
    id: number;
    firstname: string;
    lastname: string;
    isOrganizer: true;
};

export type Participant = Student | Pupil | Screener;

export type Attendee = Participant | Organizer;
