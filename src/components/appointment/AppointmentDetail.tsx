import { Box, Modal, useBreakpointValue, useTheme, useToast } from 'native-base';
import { useTranslation } from 'react-i18next';
import { useCallback, useMemo, useState } from 'react';
import { Appointment } from '../../types/lernfair/Appointment';
import AppointmentMetaDetails from './AppointmentMetaDetails';
import Header from './Header';
import Avatars from './Avatars';
import Description from './Description';
import { DateTime } from 'luxon';
import { useMutation } from '@apollo/client';
import useApollo from '../../hooks/useApollo';
import { useNavigate } from 'react-router-dom';
import RejectAppointmentModal, { RejectType } from '../../modals/RejectAppointmentModal';
import { gql } from '../../gql';
import { Course_Category_Enum, Lecture_Appointmenttype_Enum } from '../../gql/graphql';
import { PUPIL_APPOINTMENT } from '../../pages/Appointment';
import { Typography } from '../Typography';
import { IconInfoCircle, IconClockEdit, IconTrash, IconPencil } from '@tabler/icons-react';
import { Button } from '../Button';
import AddToCalendarDropdown from '../AddToCalendarDropdown';
import { useCanJoinMeeting } from '@/hooks/useCanJoinMeeting';

type AppointmentDetailProps = {
    appointment: Appointment;
    startMeeting?: boolean;
};

const AppointmentDetail: React.FC<AppointmentDetailProps> = ({ appointment }) => {
    const { t, i18n } = useTranslation();
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

    const { date, startTime, endTime } = useMemo(() => {
        const start = DateTime.fromISO(appointment.start).setLocale(i18n.language);
        const date = start.toFormat('cccc, dd. LLLL yyyy');
        const startTime = start.toFormat('HH:mm');
        const end = start.plus({ minutes: appointment.duration });
        const endTime = end.toFormat('HH:mm');
        return { date, startTime, endTime };
    }, [appointment.duration, appointment.start, i18n.language]);

    const countAttendees = useCallback(() => {
        const participants = appointment.participants ? appointment.participants.length : 0;
        const organizers = appointment.organizers ? appointment.organizers.length : 0;
        return participants + organizers;
    }, [appointment.organizers, appointment.participants]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const attendeesCount = useMemo(() => countAttendees(), [appointment.participants, appointment.organizers]);

    const isPastAppointment = useMemo(() => {
        return DateTime.fromISO(appointment.start).toMillis() + appointment.duration * 60000 < DateTime.now().toMillis();
    }, [appointment.duration, appointment.start]);

    const handleCancelClick = useCallback(() => {
        toast.show({ description: t('appointment.detail.canceledToast'), placement: 'top' });
        setCanceled(true);
        cancelAppointment({ variables: { appointmentId: appointment.id } });
        navigate(-1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDeclineClick = useCallback(() => {
        toast.show({ description: t('appointment.detail.canceledToast'), placement: 'top' });
        setCanceled(true);
        declineAppointment({ variables: { appointmentId: appointment.id } });
        setShowDeclineModal(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const attendees = useMemo(() => {
        return appointment.organizers && appointment.participants ? [...appointment.organizers, ...appointment.participants] : [];
    }, [appointment.organizers, appointment.participants]);

    const isLastAppointment = useMemo(
        () => (appointment.appointmentType === Lecture_Appointmenttype_Enum.Group && appointment.total === 1 ? true : false),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [appointment.total]
    );

    const wasRejected = !!appointment.participants?.every((e) => appointment.declinedBy?.includes(e.userID!));
    const byMatch = !appointment.declinedBy?.includes(user?.userID!);
    const wasRejectedByMe = appointment.declinedBy?.includes(user?.userID!);
    const wasRejectedByMatch = appointment.appointmentType === 'match' && wasRejected && byMatch;

    const isCurrent = useCanJoinMeeting(appointment.isOrganizer ? 240 : 10, appointment.start, appointment.duration);

    const canAddToCalendar = !wasRejected && !appointment.declinedBy?.length && !isPastAppointment && !isCurrent;

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
                    showParticipants={appointment.subcourse?.course?.category !== Course_Category_Enum.HomeworkHelp}
                />
                {wasRejectedByMatch && (
                    <>
                        <div className="flex gap-x-1 items-center mt-4">
                            <IconInfoCircle className="text-red-600" size={18} />
                            <Typography className="text-red-600">{t('appointment.detail.cancelledBy', { name: appointment.displayName })}</Typography>
                        </div>
                        <Typography>{t('appointment.detail.rescheduleDescription', { name: appointment.displayName })}</Typography>
                    </>
                )}
                <Description description={appointment.description} />
                <div className="flex flex-col md:flex-row gap-3">
                    {appointment.isOrganizer && (
                        <>
                            <Button
                                disabled={isPastAppointment}
                                reasonDisabled={t('appointment.detail.reasonDisabled.editBtn.isOver')}
                                variant={wasRejectedByMatch ? 'default' : 'outline'}
                                onClick={() => navigate(`/edit-appointment/${appointment.id}`)}
                                className="w-full lg:w-[300px]"
                                leftIcon={wasRejectedByMatch ? <IconClockEdit /> : <IconPencil />}
                            >
                                {wasRejectedByMatch ? t('appointment.detail.rescheduleButton') : t('appointment.detail.editButton')}
                            </Button>
                            {canAddToCalendar && <AddToCalendarDropdown buttonClasses="w-full lg:w-[300px]" appointment={appointment} />}
                            <Button
                                disabled={isPastAppointment || isLastAppointment}
                                reasonDisabled={
                                    isPastAppointment
                                        ? t('appointment.detail.reasonDisabled.deleteBtn.isOver')
                                        : t('appointment.detail.reasonDisabled.deleteBtn.isLast')
                                }
                                onClick={() => setShowDeleteModal(true)}
                                variant="destructive"
                                className="w-full lg:w-[300px]"
                                leftIcon={<IconTrash />}
                            >
                                {t('appointment.detail.deleteButton')}
                            </Button>
                        </>
                    )}
                    {appointment.isParticipant && (
                        <>
                            {canAddToCalendar && <AddToCalendarDropdown buttonClasses="w-full lg:w-[300px]" appointment={appointment} />}
                            <Button
                                disabled={(wasRejectedByMe ?? false) || canceled || isPastAppointment}
                                reasonDisabled={
                                    isPastAppointment
                                        ? t('appointment.detail.reasonDisabled.cancelBtn.isOver')
                                        : t('appointment.detail.reasonDisabled.cancelBtn.isCancelled')
                                }
                                onClick={() => setShowDeclineModal(true)}
                                variant="destructive"
                                className="w-full lg:w-[300px]"
                            >
                                {t('appointment.detail.cancelButton')}
                            </Button>
                        </>
                    )}
                </div>
            </Box>
        </>
    );
};

export default AppointmentDetail;
