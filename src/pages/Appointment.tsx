// eslint-disable-next-line lernfair-app-linter/typed-gql
import { gql, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import AppointmentDetail from '../components/appointment/AppointmentDetail';
import WithNavigation from '../components/WithNavigation';
import NotificationAlert from '../components/notifications/NotificationAlert';
import { useUserType } from '../hooks/useApollo';
import CenterLoadingSpinner from '../components/CenterLoadingSpinner';
import { Lecture_Appointmenttype_Enum } from '../gql/graphql';
import { Breadcrumb } from '@/components/Breadcrumb';
import { useBreadcrumbRoutes } from '@/hooks/useBreadcrumb';
import { useTranslation } from 'react-i18next';

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

type AppointmentParams = {
    startMeeting?: boolean;
};

const Appointment: React.FC<AppointmentParams> = ({ startMeeting }) => {
    const userType = useUserType();
    const { id } = useParams();
    const appointmentId = parseFloat(id ? id : '');
    const breadcrumbRoutes = useBreadcrumbRoutes();
    const { t } = useTranslation();

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

    const data = studentAppointment ?? pupilAppointment;
    const loading = isLoadingStudentAppointment ?? isLoadingpupilAppointment;
    const error = studentAppointmentError ?? pupilAppointmentError;

    const getDefaultPreviousPath = () => {
        const apppointmentType: Lecture_Appointmenttype_Enum = data?.appointment?.appointmentType;
        if (apppointmentType === Lecture_Appointmenttype_Enum.Match && data?.appointment?.matchId) {
            return `/match/${data?.appointment?.matchId}`;
        } else if (apppointmentType === Lecture_Appointmenttype_Enum.Group && data?.appointment?.subcourseId) {
            return `/single-course/${data?.appointment?.subcourseId}`;
        }
        return '/appointments';
    };

    const appointmentTile = data?.appointment?.title || t('appointment.appointmentTile.lecture', { position: data?.appointment?.position });
    return (
        <WithNavigation previousFallbackRoute={getDefaultPreviousPath()} headerLeft={<NotificationAlert />}>
            <Breadcrumb
                className="mx-4"
                items={[breadcrumbRoutes.APPOINTMENTS, { label: data?.appointment?.displayName, route: getDefaultPreviousPath() }, { label: appointmentTile }]}
            />
            {loading && <CenterLoadingSpinner />}
            {!error && data?.appointment && <AppointmentDetail appointment={data?.appointment} startMeeting={startMeeting} />}
        </WithNavigation>
    );
};

export default Appointment;
