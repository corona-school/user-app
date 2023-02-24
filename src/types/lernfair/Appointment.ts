import { AppointmentType as TAppointmentType } from './CreateAppointment';
import { Organizer, Participant } from './User';

export enum AppointmentTypes {
    GROUP = 'group',
    MATCH = 'match',
    OTHER_INTERNAL = 'other_internal',
    LEGACY_LECTURE = 'legacy_lecture',
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
    organizers?: Organizer[];
    participants?: Participant[];
    isCancelled?: boolean;
    declinedBy?: number[];
    appointmentType: AppointmentTypes;
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

export type Course = {
    name: string;
    description: string;
};
