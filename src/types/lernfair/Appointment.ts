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
