import { Weeklies, AppointmentType as TAppointmentType } from '../../context/CreateAppointment';

// TODO delete AppointmentType
export type AppointmentType = {
    id: number;
    title: string;
    organizers: Attendee[];
    startDate: string;
    duration: number;
    meetingLink: string;
    subcourseId: number;
    participants: Attendee[];
    declinedBy: { id: number }[];
    isCancelled: boolean;
    appointmentType: string;
};

// TODO real type for Appointment
export type Appointment = {
    title: string;
    description: string;
    start: string;
    duration: number;
    subcourseId?: number;
    matchId?: number;
    organizers?: number[];
    participants_pupil?: number[];
    participants_student?: number[];
    participants_screener?: number[];
    appointmentType?: AppointmentType;
};

// type of appointments to send to the BE
export type CreateAppointment = {
    title: string;
    description: string;
    start: string;
    duration: number;
    subcourseId?: number;
    matchId?: number;
    organizers?: number[];
    appointmentType?: TAppointmentType;
};

export type BaseAppointment = {
    title: string;
    description: string;
    start: string;
    duration: number;
    subcourseId: number;
};

export type CreateAppointmentWithWeeklies = {
    baseAppointment: CreateAppointment;
    weeklyText: Weeklies;
};

export type Course = {
    name: string;
    description: string;
};

export type Attendee = {
    firstname: string;
    lastname: string;
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
