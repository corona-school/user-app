import { AppointmentType, Organizer, Participant } from '../../gql/graphql';

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
    declinedBy?: number[];
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
    appointmentType?: AppointmentType;
};

export type Course = {
    name: string;
    description: string;
};
