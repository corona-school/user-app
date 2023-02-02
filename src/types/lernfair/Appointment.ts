export type AppointmentType = {
    id: number;
    title: string;
    organizers: Attendee[];
    startDate: string;
    duration: number;
    meetingLink: string;
    subcourseId: number;
    participants: Attendee[];
    declinedBy: { id: number }[];
    isCancelled: boolean;
    appointmentType: string;
};

export type Course = {
    name: string;
    description: string;
};

export type Attendee = {
    firstname: string;
    lastname: string;
};

export enum AppointmentTypes {
    GROUP = 'GROUP',
    ONE_TO_ONE = 'ONE_TO_ONE',
    TRAINING = 'TRAINING',
}

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
