import { Appointment } from './Appointment';
import { Subject } from '../../gql/graphql';
import { LFPupil, LFStudent } from './User';

export type LFMatch = {
    id: number;
    dissolved: boolean;
    pupil: any;
    student: any;
    subjectsFormatted: Subject[];
    uuid: string;
    studentEmail: string;
    pupilEmail: string;
    appointments?: Appointment[];
};
