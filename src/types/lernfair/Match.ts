import { Appointment } from './Appointment';
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

// TODO remove
export type Match = {
    id: number;
    dissolved: boolean;
    pupil: any;
    student: any;
    subjectsFormatted: LFSubject[];
    uuid: string;
    studentEmail: string;
    pupilEmail: string;
    appointments: Appointment[];
};
