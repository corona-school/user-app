import { Appointment } from './Appointment';
import { Subject } from '../../gql/graphql';

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
