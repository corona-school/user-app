import { useMemo, useState } from 'react';
import { Lecture, Lecture_Appointmenttype_Enum } from '../gql/graphql';
import { canJoinMeeting } from './appointment/AppointmentDay';
import { DateTime } from 'luxon';
import { Box, Button, Heading, Tooltip, VStack, useTheme, Text } from 'native-base';
import AppointmentCard from './AppointmentCard';
import { useNavigate } from 'react-router-dom';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { useTranslation } from 'react-i18next';

type Props = {
    appointments: Lecture[];
};
const NextAppointmentCard: React.FC<Props> = ({ appointments }) => {
    const [showMeetingNotStarted, setShowMeetingNotStarted] = useState<boolean>();
    const { trackEvent } = useMatomo();
    const { space } = useTheme();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const myNextAppointments = useMemo(() => {
        const nextAppointment = appointments;
        const nextAvailableAppointments = nextAppointment.filter((appointment) => {
            const { start, duration, isOrganizer } = appointment;
            const canStartMeeting = canJoinMeeting(start, duration, isOrganizer ? 30 : 10, DateTime.now());
            canStartMeeting ? setShowMeetingNotStarted(true) : setShowMeetingNotStarted(false);
            return canStartMeeting;
        });

        return nextAvailableAppointments.length > 0 ? nextAvailableAppointments : [nextAppointment[0]];
    }, [appointments]);

    return (
        <Box>
            {myNextAppointments && (
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
                </VStack>
            )}
        </Box>
    );
};

export default NextAppointmentCard;
