import { useMemo } from 'react';
import { Lecture, Lecture_Appointmenttype_Enum } from '../gql/graphql';
import { DateTime } from 'luxon';
import { Box, Heading, VStack, useTheme } from 'native-base';
import AppointmentCard from './AppointmentCard';
import { useNavigate } from 'react-router-dom';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { useTranslation } from 'react-i18next';
import AlertMessage from './AlertMessage';

type Props = {
    appointments: Lecture[];
};

const isCurrentOrOver = (start: string, duration: number, joinBeforeMinutes: number, now: DateTime): boolean => {
    const startDate = DateTime.fromISO(start).minus({ minutes: joinBeforeMinutes });
    const end = DateTime.fromISO(start).plus({ minutes: duration }).plus({ minutes: 10 });
    return now.toUnixInteger() >= startDate.toUnixInteger() && now.toUnixInteger() <= end.toUnixInteger();
};

const NextAppointmentCard: React.FC<Props> = ({ appointments }) => {
    const { trackEvent } = useMatomo();
    const { space } = useTheme();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const myNextAppointments = useMemo(() => {
        const nextAvailableAppointments = appointments.filter((appointment) => {
            const { start, duration, isOrganizer, subcourse } = appointment;
            const isCurrent = isCurrentOrOver(start, duration, isOrganizer ? 30 : 10, DateTime.now());
            const isSubcoursePublished = subcourse?.published;
            if (subcourse && !isSubcoursePublished) {
                return false;
            } else {
                return isCurrent;
            }
        });

        return nextAvailableAppointments.length > 0 ? nextAvailableAppointments : appointments.slice(0, 1);
    }, [appointments]);

    return (
        <Box>
            <VStack marginBottom={space['1.5']}>
                <Heading marginBottom={space['1']}>{t('dashboard.appointmentcard.header')}</Heading>
                {myNextAppointments.length > 0 ? (
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
                                    date={myNextAppointment.start}
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
                ) : (
                    <AlertMessage content={t('appointment.noNextAppointment')} />
                )}
            </VStack>
        </Box>
    );
};

export default NextAppointmentCard;
