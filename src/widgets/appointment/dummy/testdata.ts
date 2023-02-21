import { Appointment, AppointmentTypes } from '../../../types/lernfair/Appointment';

export const appointmentsData: Appointment[] = [
    {
        id: 108,
        title: 'Test TD',
        description: 'Testbeschreibung TD',
        start: '2023-02-14T16:00:00.000Z',
        duration: 15,
        subcourseId: 1,
        matchId: null,
        meetingLink: null,
        appointmentType: AppointmentTypes.GROUP,
    },
];
