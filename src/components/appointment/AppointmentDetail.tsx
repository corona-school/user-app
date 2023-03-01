import { Box, Modal, useBreakpointValue, useTheme, useToast } from 'native-base';
import { useTranslation } from 'react-i18next';
import { useCallback, useMemo, useState } from 'react';
import { Appointment } from '../../types/lernfair/Appointment';
import MetaDetails from './MetaDetails';
import Header from './Header';
import Avatars from './Avatars';
import Description from './Description';
import Buttons from './Buttons';
import { DateTime } from 'luxon';
import { gql, useMutation, useQuery } from '@apollo/client';
import useApollo from '../../hooks/useApollo';
import { useNavigate } from 'react-router-dom';
import DeleteAppointmentModal from '../../modals/DeleteAppointmentModal';

type AppointmentDetailProps = {
    appointment: Appointment;
    id?: number;
};

type AppointmentDates = {
    date: string;
    startTime: string;
    endTime: string;
};

const QUERY_MATCH = gql`
    query match($id: Int!) {
        match(matchId: $id) {
            id
            pupil {
                firstname
                lastname
            }
        }
    }
`;

const QUERY_SUBCOURSE = gql`
    query course($id: Int!) {
        subcourse(subcourseId: $id) {
            course {
                name
                description
            }
            instructors {
                firstname
                lastname
            }
        }
    }
`;

const AppointmentDetail: React.FC<AppointmentDetailProps> = ({ appointment, id }) => {
    const { t } = useTranslation();
    const toast = useToast();
    const { space, sizes } = useTheme();
    const { user } = useApollo();
    const [canceled, setCanceled] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const navigate = useNavigate();
    const { data } = useQuery(appointment.matchId ? QUERY_MATCH : QUERY_SUBCOURSE, { variables: { id } });

    const containerWidth = useBreakpointValue({
        base: 'full',
        lg: sizes['containerWidth'],
    });

    const [cancelAppointment] = useMutation(gql`
        mutation cancelAppointment($appointmentId: Float!) {
            appointmentCancel(appointmentId: $appointmentId)
        }
    `);

    const [declineAppointment] = useMutation(gql`
        mutation declineAppointment($appointmentId: Float!) {
            appointmentDecline(appointmentId: $appointmentId)
        }
    `);

    const getAppointmentDateTime = useCallback((appointmentStart: string, duration?: number): AppointmentDates => {
        const start = DateTime.fromISO(appointmentStart).setLocale('de');
        const date = start.setLocale('de').toFormat('cccc, dd. LLLL yyyy');
        const startTime = start.setLocale('de').toFormat('HH:mm');
        const end = start.plus({ minutes: duration });
        const endTime = end.setLocale('de').toFormat('HH:mm');

        return { date, startTime, endTime };
    }, []);

    const { date, startTime, endTime } = useMemo(
        () => getAppointmentDateTime(appointment.start, appointment.duration),
        [appointment.duration, appointment.start, getAppointmentDateTime]
    );

    const countAttendees = useCallback(() => {
        const participants = appointment.participants ? appointment.participants.length : 0;
        const organizers = appointment.organizers ? appointment.organizers.length : 0;
        return participants + organizers;
    }, [appointment.organizers, appointment.participants]);

    const attendeesCount = useMemo(() => countAttendees(), [appointment.participants, appointment.organizers]);

    const handleCancelClick = useCallback(() => {
        toast.show({ description: t('appointment.detail.canceledToast'), placement: 'top' });
        setCanceled(true);
        cancelAppointment({ variables: { appointmentId: appointment.id } });
        navigate('/appointments');
    }, []);

    const handleDeclineClick = useCallback(() => {
        toast.show({ description: t('appointment.detail.canceledToast'), placement: 'top' });
        setCanceled(true);
        declineAppointment({ variables: { appointmentId: appointment.id } });
    }, []);

    const attendees = useMemo(() => {
        return appointment.organizers && appointment.participants ? [...appointment.organizers, ...appointment.participants] : [];
    }, [appointment.organizers, appointment.participants]);

    return (
        <>
            <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <DeleteAppointmentModal onDelete={() => handleCancelClick()} close={() => setShowDeleteModal(false)} />
            </Modal>
            <Box paddingX={space['1']} marginX="auto" width="100%" maxW={containerWidth}>
                <Avatars attendees={attendees} />
                <Header
                    appointmentType={appointment.appointmentType}
                    organizers={appointment.organizers}
                    courseName={data?.subcourse?.course?.name}
                    appointmentTitle={appointment.title}
                />
                <MetaDetails
                    date={date}
                    startTime={startTime}
                    endTime={endTime}
                    duration={appointment.duration}
                    count={appointment.position ? appointment.position : 0}
                    total={appointment.total ? appointment.total : 0}
                    attendeesCount={attendeesCount}
                    organizers={appointment.organizers || []}
                    participants={appointment.participants || []}
                    declinedBy={[1]}
                />
                <Description description={appointment.description} />

                <Buttons onPress={user?.student ? () => setShowDeleteModal(true) : handleDeclineClick} canceled={canceled} />
            </Box>
        </>
    );
};

export default AppointmentDetail;
