import { Appointment } from '../../types/lernfair/Appointment';

export const pupilsAppointments: Appointment[] = [
    {
        id: 1,
        title: 'TD Test',
        organizers: [
            {
                firstname: 'Anna',
                lastname: 'Müller',
            },
        ],
        startDate: '2023-01-09T14:00:00Z',
        duration: 90,
        meetingLink: 'https://www.lern-fair.de/',
        subcourseId: 2,
        lectureId: 2,
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
        declinedBy: [{ id: 1 }],
        isCancelled: false,
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
        startDate: '2023-01-12T12:00:00Z',
        duration: 60,
        meetingLink: 'https://www.lern-fair.de/',
        subcourseId: 2,
        lectureId: 2,
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
        declinedBy: [{ id: 1 }],
        isCancelled: false,
        appointmentType: 'GROUP',
    },
    {
        id: 3,
        title: 'React for Beginners',
        organizers: [
            {
                firstname: 'Manuel',
                lastname: 'Schmid',
            },
        ],
        startDate: '2023-02-11T08:00:00Z',
        duration: 60,
        meetingLink: 'https://www.lern-fair.de/',
        subcourseId: 2,
        lectureId: 2,
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
        declinedBy: [{ id: 1 }],
        isCancelled: false,
        appointmentType: 'GROUP',
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
        startDate: '2023-02-11T08:00:00Z',
        duration: 60,
        meetingLink: 'https://www.lern-fair.de/',
        subcourseId: 2,
        lectureId: 2,
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
        declinedBy: [{ id: 1 }],
        isCancelled: false,
        appointmentType: 'GROUP',
    },
];
