import { gql, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import AppointmentDetail from '../components/appointment/AppointmentDetail';
import WithNavigation from '../components/WithNavigation';

const APPOINTMENT = gql`
    query appointment($appointmentId: Float!) {
        appointment(appointmentId: $appointmentId) {
            id
            start
            duration
            title
            description
            appointmentType
            meetingLink
            isCanceled
            subcourseId
            matchId
            participants(skip: 0, take: 10) {
                id
                firstname
                lastname
            }
            organizers(skip: 0, take: 10) {
                id
                firstname
                lastname
            }
            isOrganizer
            isParticipant
            declinedBy(skip: 0, take: 10) {
                id
                firstname
                lastname
                isStudent
                isPupil
            }
        }
    }
`;

const Appointment = () => {
    const { id } = useParams();
    const appointmentId = parseFloat(id ? id : '');
    const { data, error } = useQuery(APPOINTMENT, { variables: { appointmentId } });

    return (
        <WithNavigation showBack>
            {!error && data?.appointment && (
                <AppointmentDetail
                    appointment={data?.appointment}
                    id={data?.appointment?.subcourseId != null ? data?.appointment?.subcourseId : data?.appointment?.matchId}
                />
            )}
        </WithNavigation>
    );
};

export default Appointment;
