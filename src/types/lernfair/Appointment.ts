export type AppointmentType = {
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

export type CalendarDates = {
    [year: number]: {
        [month: number]: {
            [week: number]: AppointmentType[];
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
    [week: number]: AppointmentType[];
};
