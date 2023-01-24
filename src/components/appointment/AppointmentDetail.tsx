import { Box, Button, Stack, useBreakpointValue, useTheme, useToast } from 'native-base';
import { useTranslation } from 'react-i18next';
import { useLayoutHelper } from '../../hooks/useLayoutHelper';
import { getAppointmentDateTime } from '../../helper/appointment-helper';
import { useCallback, useState } from 'react';
import { AppointmentType, Course } from '../../types/lernfair/Appointment';
import useApollo from '../../hooks/useApollo';
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
    const { isMobile } = useLayoutHelper();
    const { t } = useTranslation();
    const toast = useToast();
    const { space, sizes } = useTheme();
    const [canceled, setCanceled] = useState<boolean>(false);

    const buttonWidth = useBreakpointValue({
        base: 'full',
        lg: '300',
    });

    const containerWidth = useBreakpointValue({
        base: 'full',
        lg: sizes['containerWidth'],
    });

    const cancelAppointment = useCallback(() => {
        toast.show({ description: t('appointment.appointmentDetail.canceledToast'), placement: 'top' });
        setCanceled(true);
        // TODO mutation: declinedBy.push(participant)
    }, []);

    const { date, startTime, endTime } = getAppointmentDateTime(appointment.startDate, appointment.duration);

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
                attendeesCount={appointment.participants.length + appointment.organizers.length}
                meetingLink={appointment.meetingLink}
            />
            <Description appointmentType={appointment.appointmentType} courseName={course?.name} courseDescription={course?.description} />
            <Buttons onPress={cancelAppointment} canceled={canceled} />
        </Box>
    );
};

export default AppointmentDetail;
