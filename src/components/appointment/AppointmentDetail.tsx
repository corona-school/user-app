import { Box, useBreakpointValue, useTheme, useToast } from 'native-base';
import { useTranslation } from 'react-i18next';
import { useCallback, useMemo, useState } from 'react';
import { Appointment, Course } from '../../types/lernfair/Appointment';
import MetaDetails from './MetaDetails';
import Header from './Header';
import Avatars from './Avatars';
import Description from './Description';
import Buttons from './Buttons';
import { DateTime } from 'luxon';

type AppointmentDetailProps = {
    appointment: Appointment;
    course?: Course;
};

type AppointmentDates = {
    date: string;
    startTime: string;
    endTime: string;
};

const AppointmentDetail: React.FC<AppointmentDetailProps> = ({ appointment, course }) => {
    const { t } = useTranslation();
    const toast = useToast();
    const { space, sizes } = useTheme();
    const [canceled, setCanceled] = useState<boolean>(false);
    const containerWidth = useBreakpointValue({
        base: 'full',
        lg: sizes['containerWidth'],
    });

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

    const cancelAppointment = useCallback(() => {
        toast.show({ description: t('appointment.detail.canceledToast'), placement: 'top' });
        setCanceled(true);
        // TODO mutation to set participant declined
    }, []);

    return (
        <Box paddingX={space['1']} marginX="auto" width="100%" maxW={containerWidth}>
            {/* // TODO handle empty array */}
            <Avatars organizers={[]} participants={[]} />
            <Header appointmentType={appointment.appointmentType} organizers={[]} title={appointment.title} />
            <MetaDetails
                date={date}
                startTime={startTime}
                endTime={endTime}
                duration={appointment.duration}
                count={1}
                total={5}
                attendeesCount={attendeesCount}
                organizers={appointment.organizers}
                participants={appointment.participants}
                declinedBy={appointment.declinedBy}
                // meetingLink={appointment.meetingLink}
            />
            <Description appointmentType={appointment.appointmentType} courseName={course?.name} courseDescription={course?.description} />
            <Buttons onPress={cancelAppointment} canceled={canceled} />
        </Box>
    );
};

export default AppointmentDetail;
