import { ClassRange } from './SchoolClass';
import { State } from './State';
import { LFSubject } from './Subject';

export type LFUserType = string | 'pupil' | 'student';

export type LFPupil = {
    id?: string;
    firstname?: string;
    lastname?: string;
    state?: State;
};

export type Participant = {
    id: string;
    firstname: string;
    lastname: string;
    grade: number;
    schooltype: string;
};

export type LFStudent = {
    firstname: string;
    lastname: string;
};
