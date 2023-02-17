import { Box, useBreakpointValue, useTheme, useToast } from 'native-base';
import { useTranslation } from 'react-i18next';
import { getAppointmentDateTime } from '../../helper/appointment-helper';
import { useCallback, useMemo, useState } from 'react';
import { AppointmentType, Course } from '../../types/lernfair/Appointment';
import MetaDetails from './MetaDetails';
import Header from './Header';
import Avatars from './Avatars';
import Description from './Description';
import Buttons from './Buttons';

type AppointmentDetailProps = {
    appointment: AppointmentType;
    course?: Course;
};

const AppointmentDetail: React.FC<AppointmentDetailProps> = ({ appointment, course }) => {
    const { t } = useTranslation();
    const toast = useToast();
    const { space, sizes } = useTheme();
    const [canceled, setCanceled] = useState<boolean>(false);
    const { date, startTime, endTime } = getAppointmentDateTime(appointment.start, appointment.duration);

    const countAttendees = useCallback(() => {
        // TODO change to appointment.appointment_participant_pupil, appointment.appointment_participant_student, appointment.appointment_participant_screener
        const participants = appointment.participants ? appointment.participants.length : 0;
        const organizers = appointment.organizers ? appointment.organizers.length : 0;
        return participants + organizers;
    }, [appointment.organizers, appointment.participants]);
    const attendeesCount = useMemo(() => countAttendees(), [appointment.participants, appointment.organizers]);

    const containerWidth = useBreakpointValue({
        base: 'full',
        lg: sizes['containerWidth'],
    });

    const cancelAppointment = useCallback(() => {
        toast.show({ description: t('appointment.detail.canceledToast'), placement: 'top' });
        setCanceled(true);
        // TODO mutation to set participant declined
    }, []);

    return (
        <Box paddingX={space['1']} marginX="auto" width="100%" maxW={containerWidth}>
            <Avatars organizers={appointment.organizers} participants={appointment.participants} />
            <Header appointmentType={appointment.appointmentType} organizers={appointment.organizers} title={appointment.title} />
            <MetaDetails
                date={date}
                startTime={startTime}
                endTime={endTime}
                duration={appointment.duration}
                count={1}
                total={5}
                attendeesCount={attendeesCount}
                meetingLink={appointment.meetingLink}
            />
            <Description appointmentType={appointment.appointmentType} courseName={course?.name} courseDescription={course?.description} />
            <Buttons onPress={cancelAppointment} canceled={canceled} />
        </Box>
    );
};

export default AppointmentDetail;
