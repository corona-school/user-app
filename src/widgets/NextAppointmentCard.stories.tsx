// @ts-nocheck
import NextAppointmentCard from './NextAppointmentCard';
import { MockStudent } from '../User';

export default {
    title: 'Organisms/Appointments/NextAppointmentCard',
    component: NextAppointmentCard,
};

export const BaseNextAppointmentCard = {
    render: () => (
        <MockStudent>
            <NextAppointmentCard
                appointments={[
                    {
                        id: 44,
                        title: 'Typedigital: Web 3.0',
                        description: '',
                        start: '2023-01-15T15:30:00.000Z',
                        duration: 60,
                        subcourseId: 1,
                        position: 1,
                        total: 10,
                        displayName: 'What the web?',
                        isOrganizer: true,
                        isParticipant: false,
                        isCanceled: false,

                        organizers: [
                            {
                                id: 1,
                                firstname: 'Leon',
                            },
                        ],

                        participants: [],
                        declinedBy: [],
                        appointmentType: 'group',

                        subcourse: {
                            published: true,

                            course: {
                                image: '',
                            },
                        },
                    },
                    {
                        id: 40,
                        title: 'Typedigital: Web 3.0',
                        description: '',
                        start: new Date().toISOString(),
                        duration: 60,
                        subcourseId: 2,
                        position: 1,
                        total: 10,
                        displayName: 'What the web?',
                        isOrganizer: true,
                        isParticipant: false,
                        isCanceled: false,

                        organizers: [
                            {
                                id: 1,
                                firstname: 'Leon',
                            },
                        ],

                        participants: [],
                        declinedBy: [],
                        appointmentType: 'group',

                        subcourse: {
                            published: true,

                            course: {
                                image: '',
                            },
                        },

                        course: {
                            image: '',
                        },
                    },
                ]}
            />
        </MockStudent>
    ),

    name: 'NextAppointmentCard',
};
