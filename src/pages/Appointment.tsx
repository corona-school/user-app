// eslint-disable-next-line lernfair-app-linter/typed-gql
import { gql, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import AppointmentDetail from '../components/appointment/AppointmentDetail';
import WithNavigation from '../components/WithNavigation';
import { Lecture_Appointmenttype_Enum } from '../gql/graphql';
import NotificationAlert from '../components/notifications/NotificationAlert';

const APPOINTMENT = gql(`
    query appointment($appointmentId: Float!) {
        appointment(appointmentId: $appointmentId) {
            id
            start
            duration
            title
            description
            isCanceled
            position
            appointmentType
            total
            displayName
            isOrganizer
            participants(skip: 0, take: 10) {
                id
                userID
                firstname
                lastname
            }
            organizers(skip: 0, take: 10) {
                id
                userID
                firstname
                lastname
            }
            declinedBy
            zoomMeetingId
        }
    }
`);

type AppointmentParams = {
    startMeeting?: boolean;
};

const Appointment: React.FC<AppointmentParams> = ({ startMeeting }) => {
    const { id } = useParams();
    const appointmentId = parseFloat(id ? id : '');
    const { data, error } = useQuery(APPOINTMENT, { variables: { appointmentId } });

    return (
        <WithNavigation showBack headerLeft={<NotificationAlert />}>
            {!error && data?.appointment && (
                <AppointmentDetail
                    appointment={data?.appointment}
                    id={data?.appointment?.appointmentType === Lecture_Appointmenttype_Enum.Group ? data?.appointment?.subcourseId : data?.appointment?.matchId}
                    startMeeting={startMeeting}
                />
            )}
        </WithNavigation>
    );
};

export default Appointment;
