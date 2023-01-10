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

export type AppointmentData = {
    startDate: string;
    duration: number;
    title: string;
    organizers: { firstname: string; lastname: string }[] | undefined;
    participants: { firstname: string }[] | undefined;
};

export type CalendarDates = {
    [year: number]: {
        [month: number]: {
            [week: number]: Appointment[];
        };
    };
};

export type CalendarYear = {
    [year: number]: CalendarMonth;
};

export type CalendarMonth = {
    [month: number]: CalendarWeek;
};

export type CalendarWeek = {
    [week: number]: Appointment[];
};
