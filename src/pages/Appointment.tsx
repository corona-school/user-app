import { gql, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import AppointmentDetail from '../components/appointment/AppointmentDetail';
import WithNavigation from '../components/WithNavigation';

// const appointmentQuery = gql(`
// query appointment($id: Int!) {
//    appointment(id: $id) {
//         id
// 		title,
//         organizers {
//             firstname,
//             lastname
//         },
//         startDate,
//         duration,
//         meetingLink
//         subcourseId,
//         participants {
//             firstname,
//             lastname
//         },
//         declinedBy {
//             id
//         },
//         isCancelled,
//         appointmentType
//   }
// }
// `);

// const courseQuery = gql(`
// query subcourse($subcourseId: Int!) {
//    subcourse(subcourseId: $subcourseId) {
//         id
// 		course {
//             name
//             description
//     }
//   }
// }
// `);

const Appointment = () => {
    const { id: appointmentId } = useParams();
    // const { data: appointment } = useQuery(appointmentQuery, {variables: {id: appointmentId}});
    // const { data: course } = useQuery(courseQuery, { variables: { subcourseId: appointment.appointment.id } });

    return (
        <WithNavigation showBack>
            <AppointmentDetail
                appointment={{
                    id: 1,
                    title: 'Termin #1',
                    organizers: [
                        { firstname: 'Anna', lastname: 'Maier' },
                        { firstname: 'Anna', lastname: 'Maier' },
                    ],
                    startDate: '2023-02-28T15:00:00Z',
                    duration: 60,
                    meetingLink: '',
                    subcourseId: 3,
                    participants: [
                        { firstname: 'Anna', lastname: 'Maier' },
                        { firstname: 'Tom', lastname: 'Bauer' },
                        { firstname: 'Anna', lastname: 'Maier' },
                        { firstname: 'Tom', lastname: 'Bauer' },
                    ],
                    declinedBy: [],
                    isCancelled: false,
                    appointmentType: 'ONE_TO_ONE',
                }}
                course={{
                    name: 'Grundlagen Tutorium',
                    description:
                        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
                }}
            />
        </WithNavigation>
    );
};

export default Appointment;
