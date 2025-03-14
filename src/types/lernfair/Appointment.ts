import { AppointmentParticipant, Course_Category_Enum, Lecture_Appointmenttype_Enum, Organizer } from '../../gql/graphql';

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
    override_meeting_link?: string | null;
    organizers?: Organizer[];
    participantIds?: string[];
    participants?: AppointmentParticipant[];
    isCanceled?: boolean;
    declinedBy?: string[];
    appointmentType?: Lecture_Appointmenttype_Enum;
    isOrganizer?: boolean;
    isParticipant?: boolean;
    zoomMeetingId?: string;
    zoomMeetingUrl?: string;
    subcourse?: {
        published?: boolean;
        course?: {
            category: Course_Category_Enum;
        };
    };
};

// type of appointments to send to the BE
export type CreateAppointmentInput = {
    title: string;
    description: string;
    start: string;
    duration: number;
    subcourseId?: number;
    matchId?: number;
    meetingLink: string | null;
    appointmentType: Lecture_Appointmenttype_Enum;
};

export enum AttendanceStatus {
    ACCEPTED = 'accepted',
    DECLINED = 'declined',
}
