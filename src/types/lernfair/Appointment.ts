import { Weeklies, AppointmentType as TAppointmentType } from './CreateAppointment';

// TODO delete AppointmentType
import { Student } from '../../gql/graphql';
import { Participant } from './User';

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

// TODO real type for Appointment
export type Appointment = {
    id: number;
    title: string;
    description: string;
    start: string;
    duration: number;
    subcourseId?: number;
    matchId?: number;
    meetingLink?: string;
    organizers?: Student[];
    participants?: Participant[];
    appointmentType?: AppointmentType;
};

// type of appointments to send to the BE
export type CreateAppointmentInput = {
    title: string;
    description: string;
    start: string;
    duration: number;
    subcourseId?: number;
    matchId?: number;
    organizers?: number[];
    appointmentType?: TAppointmentType;
};

export type CreateAppointmentWithWeeklies = {
    baseAppointment: CreateAppointmentInput;
    weeklyText: Weeklies;
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
