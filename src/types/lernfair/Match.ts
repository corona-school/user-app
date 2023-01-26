import { LFSubject } from './Subject';

export type LFMatch = {
    id: number;
    dissolved: boolean;
    pupil: any;
    student: any;
    subjectsFormatted: LFSubject[];
    uuid: string;
    studentEmail: string;
    pupilEmail: string;
};
