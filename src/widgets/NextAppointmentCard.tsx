import { useMemo, useState } from 'react';
import { Lecture, Lecture_Appointmenttype_Enum } from '../gql/graphql';
import { DateTime } from 'luxon';
import { Box, Heading, VStack, useTheme } from 'native-base';
import AppointmentCard from './AppointmentCard';
import { useNavigate } from 'react-router-dom';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { useTranslation } from 'react-i18next';
import useInterval from '../hooks/useInterval';

type Props = {
    appointments: Lecture[];
};

const isCurrentOrOver = (start: string, duration: number, joinBeforeMinutes: number, now: DateTime): boolean => {
    const startDate = DateTime.fromISO(start).minus({ minutes: joinBeforeMinutes });
    const end = DateTime.fromISO(start).plus({ minutes: duration }).plus({ minutes: 5 });
    return now.toUnixInteger() >= startDate.toUnixInteger() && now.toUnixInteger() <= end.toUnixInteger();
};

const NextAppointmentCard: React.FC<Props> = ({ appointments }) => {
    const { trackEvent } = useMatomo();
    const { space } = useTheme();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = useState(Date.now());

    useInterval(() => {
        setCurrentTime(Date.now());
    }, 30_000);

    const myNextAppointments = useMemo(() => {
        const nextPublishedAppointments = appointments.filter((appointment) => {
            const { subcourse } = appointment;
            if (subcourse) return subcourse?.published;
            return true;
        });

        const nextAvailableAppointments = nextPublishedAppointments.filter((appointment) => {
            const { start, duration, isOrganizer } = appointment;
            const isCurrent = isCurrentOrOver(start, duration, isOrganizer ? 30 : 10, DateTime.now());
            if (isCurrent) return true;
        });

        if (nextAvailableAppointments.length === 0) {
            const futureAppointments = nextPublishedAppointments.filter((appointment) => {
                const startDate = DateTime.fromISO(appointment.start).plus(appointment.duration);
                const now = DateTime.now();
                return startDate > now;
            });
            return futureAppointments.length > 0 ? [futureAppointments[0]] : [];
        }

        return nextAvailableAppointments;
    }, [appointments, currentTime]);

    return (
        <Box>
            <VStack marginBottom={space['1.5']}>
                <Heading marginBottom={space['1']}>{t('dashboard.appointmentcard.header')}</Heading>
                <VStack space={space['1']}>
                    {myNextAppointments.map((myNextAppointment) => {
                        return (
                            <AppointmentCard
                                hasVideoButton
                                isTeaser={true}
                                onPressToCourse={() => {
                                    trackEvent({
                                        category: 'dashboard',
                                        action: 'click-event',
                                        name: 'Schüler Dashboard – Termin Teaser | Klick auf' + myNextAppointment.displayName,
                                        documentTitle: 'Schüler Dashboard',
                                    });
                                    navigate(`/appointment/${myNextAppointment.id}`);
                                }}
                                dateFirstLecture={myNextAppointment.start}
                                duration={myNextAppointment.duration}
                                title={myNextAppointment.displayName}
                                description={myNextAppointment.description ?? ''}
                                image={myNextAppointment.subcourse?.course.image ?? ''}
                                isMatch={myNextAppointment.appointmentType === Lecture_Appointmenttype_Enum.Match ? true : false}
                                appointmentId={myNextAppointment.id}
                                appointmentType={myNextAppointment.appointmentType}
                                isOrganizer={myNextAppointment.isOrganizer}
                            />
                        );
                    })}
                </VStack>
            </VStack>
        </Box>
    );
};

export default NextAppointmentCard;
