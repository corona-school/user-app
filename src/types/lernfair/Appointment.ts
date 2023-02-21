import { Weeklies, AppointmentType as TAppointmentType } from './CreateAppointment';

import { Student } from '../../gql/graphql';
import { Participant } from './User';

export enum AppointmentTypes {
    GROUP = 'GROUP',
    ONE_TO_ONE = 'ONE_TO_ONE',
    TRAINING = 'TRAINING',
}

export type Appointment = {
    __typename?: 'Lecture' | undefined;
    id: number;
    title: string;
    description: string;
    start: string;
    duration: number;
    subcourseId?: number;
    matchId?: number | null;
    meetingLink?: string | null;
    organizers?: Student[];
    participants?: Participant[];
    isCancelled?: boolean;
    declinedBy?: number[];
    appointmentType: AppointmentTypes;
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

export enum Assignment {
    GROUP = 'Subcourse',
    MATCH = 'Match',
}
