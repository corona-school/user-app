import { Box, Modal, useBreakpointValue, useTheme, useToast } from 'native-base';
import { useTranslation } from 'react-i18next';
import { useCallback, useMemo, useState } from 'react';
import { Appointment } from '../../types/lernfair/Appointment';
import AppointmentMetaDetails from './AppointmentMetaDetails';
import Header from './Header';
import Avatars from './Avatars';
import Description from './Description';
import Buttons from './Buttons';
import { DateTime } from 'luxon';
import { useMutation } from '@apollo/client';
import useApollo from '../../hooks/useApollo';
import { useNavigate } from 'react-router-dom';
import RejectAppointmentModal, { RejectType } from '../../modals/RejectAppointmentModal';
import { gql } from '../../gql';
import { Lecture_Appointmenttype_Enum } from '../../gql/graphql';
import { PUPIL_APPOINTMENT } from '../../pages/Appointment';

type AppointmentDetailProps = {
    appointment: Appointment;
    startMeeting?: boolean;
};

type AppointmentDates = {
    date: string;
    startTime: string;
    endTime: string;
};

const AppointmentDetail: React.FC<AppointmentDetailProps> = ({ appointment }) => {
    const { t } = useTranslation();
    const toast = useToast();
    const { space, sizes } = useTheme();
    const { user } = useApollo();
    const [canceled, setCanceled] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [showDeclineModal, setShowDeclineModal] = useState<boolean>(false);
    const navigate = useNavigate();

    const containerWidth = useBreakpointValue({
        base: 'full',
        lg: sizes['containerWidth'],
    });

    const [cancelAppointment] = useMutation(
        gql(`
        mutation cancelAppointment($appointmentId: Float!) {
            appointmentCancel(appointmentId: $appointmentId)
        }
    `)
    );

    const [declineAppointment] = useMutation(
        gql(`
        mutation declineAppointment($appointmentId: Float!) {
            appointmentDecline(appointmentId: $appointmentId)
        }
    `),
        {
            refetchQueries: [{ query: PUPIL_APPOINTMENT, variables: { appointmentId: appointment.id } }],
        }
    );

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

    const isPastAppointment = useMemo(() => {
        return DateTime.fromISO(appointment.start).toMillis() + appointment.duration * 60000 < DateTime.now().toMillis();
    }, [appointment.duration, appointment.start]);

    const handleCancelClick = useCallback(() => {
        toast.show({ description: t('appointment.detail.canceledToast'), placement: 'top' });
        setCanceled(true);
        cancelAppointment({ variables: { appointmentId: appointment.id } });
        navigate(-1);
    }, []);

    const handleDeclineClick = useCallback(() => {
        toast.show({ description: t('appointment.detail.canceledToast'), placement: 'top' });
        setCanceled(true);
        declineAppointment({ variables: { appointmentId: appointment.id } });
        setShowDeclineModal(false);
    }, []);

    const attendees = useMemo(() => {
        return appointment.organizers && appointment.participants ? [...appointment.organizers, ...appointment.participants] : [];
    }, [appointment.organizers, appointment.participants]);

    const isLastAppointment = useMemo(
        () => (appointment.appointmentType === Lecture_Appointmenttype_Enum.Group && appointment.total === 1 ? true : false),
        [appointment.total]
    );
    return (
        <>
            <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <RejectAppointmentModal onDelete={() => handleCancelClick()} close={() => setShowDeleteModal(false)} rejectType={RejectType.CANCEL} />
            </Modal>
            <Modal isOpen={showDeclineModal} onClose={() => setShowDeclineModal(false)}>
                <RejectAppointmentModal onDelete={() => handleDeclineClick()} close={() => setShowDeclineModal(false)} rejectType={RejectType.DECLINE} />
            </Modal>
            <Box paddingX={space['1']} marginX="auto" width="100%" maxW={containerWidth}>
                <Avatars attendees={attendees} />
                <Header appointmentTitle={appointment.title} displayName={appointment.displayName} position={appointment.position} />
                <AppointmentMetaDetails
                    date={date}
                    startTime={startTime}
                    endTime={endTime}
                    startDateTime={appointment.start}
                    duration={appointment.duration}
                    count={appointment.position ? appointment.position : 0}
                    total={appointment.total ? appointment.total : 0}
                    attendeesCount={attendeesCount}
                    organizers={appointment.organizers ?? []}
                    participants={appointment.participants ?? []}
                    declinedBy={appointment?.declinedBy ?? []}
                    appointmentId={appointment.id}
                    appointmentType={appointment.appointmentType}
                    isOrganizer={appointment.isOrganizer}
                    overrideMeetingLink={appointment.override_meeting_link}
                    zoomMeetingUrl={appointment.zoomMeetingUrl}
                />
                <Description description={appointment.description} />

                <Buttons
                    onPress={user?.pupil ? () => setShowDeclineModal(true) : () => setShowDeleteModal(true)}
                    onEditPress={() => navigate(`/edit-appointment/${appointment.id}`)}
                    canceled={(appointment.declinedBy?.includes(user?.userID ?? '') ?? false) || canceled}
                    isOver={isPastAppointment}
                    isLast={isLastAppointment}
                />
            </Box>
        </>
    );
};

export default AppointmentDetail;
