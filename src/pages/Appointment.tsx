// eslint-disable-next-line lernfair-app-linter/typed-gql
import { gql, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import AppointmentDetail from '../widgets/AppointmentDetail';
import WithNavigation from '../components/WithNavigation';
import { Lecture_Appointmenttype_Enum } from '../gql/graphql';
import NotificationAlert from '../components/notifications/NotificationAlert';
import { useUserType } from '../hooks/useApollo';
import CenterLoadingSpinner from '../components/CenterLoadingSpinner';

export const STUDENT_APPOINTMENT = gql(`
    query appointmentStudent($appointmentId: Float!) {
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
            matchId
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

export const PUPIL_APPOINTMENT = gql(`
    query appointmentPupil($appointmentId: Float!) {
        appointment(appointmentId: $appointmentId) {
            id
            start
            duration
            title
            description
            isCanceled
            position
            appointmentType
            matchId  
            total
            displayName
            isOrganizer
            participants(skip: 0, take: 10) {
                id
                userID
                firstname
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
    const userType = useUserType();
    const { id } = useParams();
    const appointmentId = parseFloat(id ? id : '');
    const {
        data: studentAppointment,
        loading: isLoadingStudentAppointment,
        error: studentAppointmentError,
    } = useQuery(STUDENT_APPOINTMENT, { variables: { appointmentId }, skip: userType === 'pupil' });
    const {
        data: pupilAppointment,
        loading: isLoadingpupilAppointment,
        error: pupilAppointmentError,
    } = useQuery(PUPIL_APPOINTMENT, { variables: { appointmentId }, skip: userType === 'student' });

    const data = studentAppointment ?? pupilAppointment;
    const loading = isLoadingStudentAppointment ?? isLoadingpupilAppointment;
    const error = studentAppointmentError ?? pupilAppointmentError;

    return (
        <WithNavigation showBack headerLeft={<NotificationAlert />}>
            {loading && <CenterLoadingSpinner />}
            {!error && data?.appointment && (
                <AppointmentDetail appointment={data?.appointment} matchId={data?.appointment?.matchId} startMeeting={startMeeting} />
            )}
        </WithNavigation>
    );
};

export default Appointment;
