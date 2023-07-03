import { useMemo, useState } from 'react';
import { Lecture } from '../gql/graphql';
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
                                    videoButton={
                                        <VStack w="100%" space={space['0.5']}>
                                            <Tooltip isDisabled={true} maxWidth={300} label={t('course.meeting.hint.pupil')}>
                                                <Button
                                                    width="100%"
                                                    marginTop={space['1']}
                                                    onPress={() => {
                                                        navigate(`/video-chat/${myNextAppointment.id}/${myNextAppointment.appointmentType}`);
                                                    }}
                                                    isDisabled={
                                                        !myNextAppointment.id ||
                                                        !canJoinMeeting(myNextAppointment.start, myNextAppointment.duration, 10, DateTime.now())
                                                    }
                                                >
                                                    {t('course.meeting.videobutton.pupil')}
                                                </Button>
                                            </Tooltip>
                                            {showMeetingNotStarted && <Text color="lightText">{t('course.meeting.videotext')}</Text>}
                                        </VStack>
                                    }
                                    isTeaser={true}
                                    onPressToCourse={() => {
                                        DateTime.now().plus({ days: 7 }).toISODate();
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
