import { Student } from '../../gql/graphql';
import { ParticipantPupil, ParticipantScreener, ParticipantStudent } from './User';

export type AppointmentType = {
    id: number;
    title: string;
    organizers?: Attendee[];
    start: string;
    duration: number;
    meetingLink?: string;
    subcourseId: number;
    participants?: Attendee[];
    appointmentType?: AppointmentTypes;
};

export type Appointment = {
    id: number;
    title: string;
    organizers?: Student[];
    start: string;
    duration: number;
    meetingLink?: string;
    subcourseId: number;
    appointment_participant_pupil: ParticipantPupil[];
    appointment_participant_students: ParticipantStudent[];
    appointment_participant_screener: ParticipantScreener[];
    appointmentType?: string;
};

export type Course = {
    name: string;
    description: string;
};

export type Attendee = {
    firstname: string;
    lastname: string;
    declined?: boolean;
};

export enum AppointmentTypes {
    GROUP = 'GROUP',
    ONE_TO_ONE = 'ONE_TO_ONE',
    TRAINING = 'TRAINING',
}

export type CalendarDates = {
    [year: number]: {
        [month: number]: {
            [week: number]: AppointmentType[];
        };
    };
};

export type Year = {
    [year: number]: Month;
};

export type Month = {
    [month: number]: Week;
};

export type Week = {
    [week: number]: AppointmentType[];
};

export enum Assignment {
    GROUP = 'Subcourse',
    MATCH = 'Match',
}
