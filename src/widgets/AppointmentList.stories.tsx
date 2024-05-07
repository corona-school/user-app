import { Lecture_Appointmenttype_Enum } from '../gql/graphql';
import AppointmentList from './AppointmentList';

export default {
    title: 'Organisms/Appointments/AppointmentList',
    component: AppointmentList,
};

export const Base = {
    render: () => (
        <AppointmentList
            height={400}
            isReadOnlyList={true}
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
                    displayName: 'What is the web?',
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
                    appointmentType: Lecture_Appointmenttype_Enum.Group,

                    subcourse: {
                        published: true,
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
                    displayName: 'What is the web?',
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
                    appointmentType: Lecture_Appointmenttype_Enum.Group,

                    subcourse: {
                        published: true,
                    },
                },
            ]}
        />
    ),

    name: 'AppointmentList',
};
