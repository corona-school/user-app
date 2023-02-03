import { AppointmentType } from '../../../types/lernfair/Appointment';

export const pupilsAppointments: AppointmentType[] = [
    {
        id: 1,
        title: 'Scrum für Einsteiger',
        organizers: [
            {
                firstname: 'Franka',
                lastname: 'Maier',
            },
        ],
        start: '2023-01-09T14:00:00Z',
        duration: 90,
        meetingLink: 'https://www.lern-fair.de/',
        subcourseId: 2,
        participants: [
            {
                firstname: 'Anna',
                lastname: 'Müller',
            },
            {
                firstname: 'Tom',
                lastname: 'Maier',
            },
        ],
        appointmentType: 'GROUP',
    },
    {
        id: 2,
        title: 'Grundlagen Typescript',
        organizers: [
            {
                firstname: 'Anna',
                lastname: 'Müller',
            },
            {
                firstname: 'Emma',
                lastname: 'Paul',
            },
        ],
        start: '2023-01-12T12:00:00Z',
        duration: 60,
        meetingLink: 'https://www.lern-fair.de/',
        subcourseId: 2,
        participants: [
            {
                firstname: 'Anna',
                lastname: 'Müller',
            },
            {
                firstname: 'Tom',
                lastname: 'Maier',
            },
        ],
        appointmentType: 'GROUP',
    },
    {
        id: 3,
        title: 'React for Beginners',
        organizers: [
            {
                firstname: 'Leon',
                lastname: 'Kleber',
            },
        ],
        start: '2023-02-11T08:00:00Z',
        duration: 60,
        subcourseId: 2,
    },
    {
        id: 4,
        title: 'React for Intermediates',
        organizers: [
            {
                firstname: 'Clara',
                lastname: 'Kleber',
            },
        ],
        start: '2023-02-11T09:00:00Z',
        duration: 60,
        meetingLink: 'https://www.lern-fair.de/',
        subcourseId: 2,
        participants: [
            {
                firstname: 'Anna',
                lastname: 'Müller',
            },
            {
                firstname: 'Tom',
                lastname: 'Maier',
            },
        ],
        appointmentType: 'GROUP',
    },
    {
        id: 5,
        title: 'React Profis',
        organizers: [
            {
                firstname: 'Laura',
                lastname: 'Turbo',
            },
        ],
        start: '2024-05-12T08:00:00Z',
        duration: 60,
        meetingLink: 'https://www.lern-fair.de/',
        subcourseId: 2,
        participants: [
            {
                firstname: 'Anna',
                lastname: 'Müller',
            },
            {
                firstname: 'Tom',
                lastname: 'Maier',
            },
        ],
        appointmentType: 'GROUP',
    },
    {
        id: 6,
        title: 'TD Test',
        organizers: [
            {
                firstname: 'Anna',
                lastname: 'Müller',
            },
        ],
        start: '2023-01-18T12:00:00Z',
        duration: 90,
        meetingLink: 'https://www.lern-fair.de/',
        subcourseId: 2,
        participants: [
            {
                firstname: 'Anna',
                lastname: 'Müller',
            },
            {
                firstname: 'Tom',
                lastname: 'Maier',
            },
        ],
        appointmentType: 'GROUP',
    },
    {
        id: 7,
        title: 'Grundlagen Typescript',
        organizers: [
            {
                firstname: 'Anna',
                lastname: 'Müller',
            },
            {
                firstname: 'Emma',
                lastname: 'Paul',
            },
        ],
        start: '2023-01-18T12:00:00Z',
        duration: 60,
        meetingLink: 'https://www.lern-fair.de/',
        subcourseId: 2,
        participants: [
            {
                firstname: 'Anna',
                lastname: 'Müller',
            },
            {
                firstname: 'Tom',
                lastname: 'Maier',
            },
        ],
        appointmentType: 'GROUP',
    },
    {
        id: 8,
        title: 'Typescript Lektion: 1',
        organizers: [
            {
                firstname: 'Manuel',
                lastname: 'Eins',
            },
        ],
        start: '2023-08-20T15:00:00Z',
        duration: 60,
        meetingLink: 'https://www.lern-fair.de/',
        subcourseId: 2,
        participants: [
            {
                firstname: 'Anna',
                lastname: 'Müller',
            },
            {
                firstname: 'Tom',
                lastname: 'Maier',
            },
        ],
        appointmentType: 'GROUP',
    },
    {
        id: 9,
        title: 'React Lektion: 9',
        organizers: [
            {
                firstname: 'Clara',
                lastname: 'Eins',
            },
            {
                firstname: 'Paul',
                lastname: 'Zwei',
            },
        ],
        start: '2023-08-20T15:00:00Z',
        duration: 60,
        meetingLink: 'https://www.lern-fair.de/',
        subcourseId: 2,
        participants: [
            {
                firstname: 'Anna',
                lastname: 'Müller',
            },
        ],
        appointmentType: 'GROUP',
    },
    {
        id: 10,
        title: 'React 10',
        organizers: [
            {
                firstname: 'Max',
                lastname: '1',
            },
        ],
        start: '2024-12-24T16:00:00Z',
        duration: 60,
        meetingLink: 'https://www.lern-fair.de/',
        subcourseId: 2,
        participants: [
            {
                firstname: 'Anna',
                lastname: 'Müller',
            },
            {
                firstname: 'Tom',
                lastname: 'Maier',
            },
        ],
        appointmentType: 'GROUP',
    },
];
