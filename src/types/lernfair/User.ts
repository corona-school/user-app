import { State } from './State';

export enum UserType {
    STUDENT = 'student',
    PUPIL = 'pupil',
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
