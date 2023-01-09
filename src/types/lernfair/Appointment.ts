export type Appointment = {
    id: number;
    title: string;
    organizers: {
        firstname: string;
        lastname: string;
    }[];
    startDate: string;
    duration: number;
    meetingLink: string;
    subcourseId: number;
    lectureId: number;
    participants: {
        firstname: string;
        lastname: string;
    }[];
    declinedBy: { id: number }[];
    isCancelled: boolean;
    appointmentType: string;
};
