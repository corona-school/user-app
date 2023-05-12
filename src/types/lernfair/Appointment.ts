import { AppointmentParticipant, Lecture_Appointmenttype_Enum, Organizer } from '../../gql/graphql';

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
    displayName?: string;
    meetingLink?: string | null;
    organizers?: Organizer[];
    participants?: AppointmentParticipant[];
    isCanceled?: boolean;
    declinedBy?: string[];
    appointmentType?: Lecture_Appointmenttype_Enum;
    isOrganizer?: boolean;
    isParticipant?: boolean;
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
    appointmentType: Lecture_Appointmenttype_Enum;
};
