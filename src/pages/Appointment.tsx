// eslint-disable-next-line lernfair-app-linter/typed-gql
import { gql, useQuery } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import AppointmentDetail from '../components/appointment/AppointmentDetail';
import WithNavigation from '../components/WithNavigation';
import NotificationAlert from '../components/notifications/NotificationAlert';
import { useRoles, useUserType } from '../hooks/useApollo';
import CenterLoadingSpinner from '../components/CenterLoadingSpinner';
import { Lecture_Appointmenttype_Enum } from '../gql/graphql';
import { useEffect } from 'react';

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
            override_meeting_link
            zoomMeetingUrl
            subcourseId
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
            subcourse {
                published
            }
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
            total
            displayName
            isOrganizer
            override_meeting_link
            zoomMeetingUrl
            subcourseId
            matchId
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
            subcourse {
                published
            }
        }
    }
`);

export const COURSE_SCREENER_APPOINTMENT_VIEW = gql(`
    query appointmentScreener($appointmentId: Float!) {
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
            subcourseId
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
            subcourse {
                published
            }
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
    const userRoles = useRoles();
    const navigate = useNavigate();

    const {
        data: studentAppointment,
        loading: isLoadingStudentAppointment,
        error: studentAppointmentError,
    } = useQuery(STUDENT_APPOINTMENT, { variables: { appointmentId }, skip: userType !== 'student' });

    const {
        data: pupilAppointment,
        loading: isLoadingpupilAppointment,
        error: pupilAppointmentError,
    } = useQuery(PUPIL_APPOINTMENT, { variables: { appointmentId }, skip: userType !== 'pupil' });

    const {
        data: screenerAppointment,
        loading: isLoadingScreenerAppointment,
        error: screenerAppointmentError,
    } = useQuery(COURSE_SCREENER_APPOINTMENT_VIEW, { variables: { appointmentId }, skip: userType !== 'screener' });

    const data = studentAppointment ?? pupilAppointment ?? screenerAppointment;
    const loading = isLoadingStudentAppointment ?? isLoadingpupilAppointment ?? isLoadingScreenerAppointment;
    const error = studentAppointmentError ?? pupilAppointmentError ?? screenerAppointmentError;

    // Redirect course screeners if they landed on an appointment page that is not a group appointment
    useEffect(() => {
        if (data && data.appointment.appointmentType !== 'group' && userType === 'screener' &&
            (!userRoles.includes('TRUSTED_SCREENER') || !userRoles.includes('PUPIL_SCREENER') || !userRoles.includes('STUDENT_SCREENER'))) {
            navigate("/start");
        }
    }, [data]);

    const getDefaultPreviousPath = () => {
        const apppointmentType: Lecture_Appointmenttype_Enum = data?.appointment?.appointmentType;
        if (apppointmentType === Lecture_Appointmenttype_Enum.Match && data?.appointment?.matchId) {
            return `/match/${data?.appointment?.matchId}`;
        } else if (apppointmentType === Lecture_Appointmenttype_Enum.Group && data?.appointment?.subcourseId) {
            return `/single-course/${data?.appointment?.subcourseId}`;
        }
        return '/appointments';
    };

    return (
        <WithNavigation showBack previousFallbackRoute={getDefaultPreviousPath()} headerLeft={<NotificationAlert />}>
            {loading && <CenterLoadingSpinner />}
            {!error && data?.appointment && <AppointmentDetail appointment={data?.appointment} startMeeting={startMeeting} />}
        </WithNavigation>
    );
};

export default Appointment;
