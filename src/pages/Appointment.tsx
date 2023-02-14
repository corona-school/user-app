import { gql, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import AppointmentDetail from '../components/appointment/AppointmentDetail';
import WithNavigation from '../components/WithNavigation';
import { AppointmentTypes } from '../types/lernfair/Appointment';

const Appointment = () => {
    const { id: appointmentId } = useParams();
    // const { data: appointment } = useQuery(appointmentQuery, {variables: {id: appointmentId}});

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
                    start: '2023-02-28T15:00:00Z',
                    duration: 60,
                    meetingLink: '',
                    subcourseId: 3,
                    participants: [
                        { firstname: 'Anna', lastname: 'Maier' },
                        { firstname: 'Tom', lastname: 'Bauer' },
                        { firstname: 'Anna', lastname: 'Maier' },
                        { firstname: 'Tom', lastname: 'Bauer' },
                    ],
                    appointmentType: AppointmentTypes.GROUP,
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
