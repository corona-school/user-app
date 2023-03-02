import { AppointmentType } from '../../gql/graphql';

import { Organizer, Participant } from './User';

export type Appointment = {
    __typename?: 'Lecture' | undefined;
    id: number;
    title: string;
    description: string;
    start: string;
    duration: number;
    subcourseId?: number;
    matchId?: number | null;
    position?: number;
    total?: number;
    meetingLink?: string | null;
    organizers?: Organizer[];
    participants?: Participant[];
    isCancelled?: boolean;
    declinedBy?: AttendeesDeclined[];
    appointmentType: AppointmentType;
};

export type AttendeesDeclined = {
    id: number;
    firstname: string;
    lastname: string;
    isStudent: boolean;
    isPupil: boolean;
};

// type of appointments to send to the BE
export type CreateAppointmentInput = {
    title: string;
    description: string;
    start: string;
    duration: number;
    subcourseId?: number;
    matchId?: number;
    meetingLink: string;
    appointmentType: AppointmentType;
};

export type Course = {
    name: string;
    description: string;
};
