import { State } from './State';

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

export type Pupil = {
    id: number;
    firstname: string;
    lastname: string;
    gradeAsInt?: number;
    isPupil?: true;
    isStudent?: false;
};

export type Student = {
    id: number;
    firstname: string;
    lastname: string;
    isPupil?: false;
    isStudent?: true;
};

export type LFUser = Pupil | Student;
