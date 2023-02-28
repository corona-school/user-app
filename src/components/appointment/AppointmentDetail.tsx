import { Box, useBreakpointValue, useTheme, useToast } from 'native-base';
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
    query match($matchId: Int!) {
        match(matchId: $matchId) {
            id
            pupil {
                firstname
                lastname
            }
        }
    }
`;

const QUERY_SUBCOURSE = gql`
    query course($courseId: Int!) {
        subcourse(subcourseId: $courseId) {
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
        const cancelRes = cancelAppointment({ variables: { appointmentId: appointment.id } });
        console.log(cancelRes);
    }, []);

    const handleDeclineClick = useCallback(() => {
        toast.show({ description: t('appointment.detail.canceledToast'), placement: 'top' });
        setCanceled(true);
        const cancelRes = declineAppointment({ variables: { appointmentId: appointment.id } });
    }, []);

    const attendees = useMemo(() => {
        return appointment.organizers && appointment.participants ? [...appointment.organizers, ...appointment.participants] : [];
    }, [appointment.organizers, appointment.participants]);

    return (
        <Box paddingX={space['1']} marginX="auto" width="100%" maxW={containerWidth}>
            <Avatars attendees={attendees} />
            <Header appointmentType={appointment.appointmentType} organizers={appointment.organizers} title={appointment.title} />
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
            />
            <Description
                appointmentType={appointment.appointmentType}
                courseName={data?.subcourse?.course?.name}
                courseDescription={data?.subcourse?.course?.description ? data?.subcourse?.course?.description : ''}
            />
            <Buttons onPress={user?.student ? handleCancelClick : handleDeclineClick} canceled={canceled} />
        </Box>
    );
};

export default AppointmentDetail;
