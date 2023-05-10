import { Button, HStack, Modal, Pressable, Spacer, Stack, Text, useBreakpointValue } from 'native-base';
import InformationBadge from '../notifications/preferences/InformationBadge';
import DateIcon from '../../assets/icons/lernfair/appointments/appointment_date.svg';
import TimeIcon from '../../assets/icons/lernfair/appointments/appointment_time.svg';
import PersonIcon from '../../assets/icons/lernfair/appointments/appointment_person.svg';
import RepeatIcon from '../../assets/icons/lernfair/appointments/appointment_repeat.svg';
import { useLayoutHelper } from '../../hooks/useLayoutHelper';
import { useTranslation } from 'react-i18next';
import AttendeesModal from '../../modals/AttendeesModal';
import { useState } from 'react';
import { AppointmentParticipant, Organizer } from '../../gql/graphql';
import ZoomMeeting from '../ZoomMeeting';

type MetaProps = {
    date: string;
    startTime: string;
    endTime: string;
    startDateTime: string;
    duration: number;
    count: number;
    total: number;
    attendeesCount?: number;
    organizers?: Organizer[];
    participants?: AppointmentParticipant[];
    declinedBy: string[];
    meetingId?: string;
    startChat?: boolean;
};
const MetaDetails: React.FC<MetaProps> = ({
    date,
    startTime,
    endTime,
    startDateTime,
    duration,
    count,
    total,
    attendeesCount,
    organizers,
    participants,
    declinedBy,
    meetingId,
    startChat,
}) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showVideoChat, setShowVideoChat] = useState<boolean>(startChat || false);
    const { isMobile } = useLayoutHelper();
    const { t } = useTranslation();

    const buttonWidth = useBreakpointValue({
        base: 'full',
        lg: '300',
    });

    function isWithinAppointmentTime(appointmentStart: string, duration: number) {
        const TEN_MINUTES_IN_MS = 10 * 60 * 1000;
        const start = new Date(new Date(appointmentStart).getTime() - TEN_MINUTES_IN_MS);
        const end = new Date(start.getTime() + (duration + 10 || 0) * 60 * 1000 + TEN_MINUTES_IN_MS);
        const now = new Date();

        console.log(start, end, now);

        return now >= start && now <= end;
    }

    return (
        <>
            <Modal isOpen={showModal} backgroundColor="transparent" onClose={() => setShowModal(false)}>
                <AttendeesModal organizers={organizers} participants={participants} declinedBy={declinedBy} onClose={() => setShowModal(false)} />
            </Modal>

            <Stack direction={isMobile ? 'column' : 'row'} space={isMobile ? 5 : 7}>
                <HStack space={2} alignItems="center">
                    <DateIcon />
                    <Text fontWeight="normal">{date}</Text>
                </HStack>
                <HStack space={2} alignItems="center">
                    <TimeIcon />
                    <Text fontWeight="normal">{t('appointment.detail.time', { start: startTime, end: endTime, duration: duration })}</Text>
                </HStack>
                <HStack space={2} alignItems="center">
                    <RepeatIcon />
                    <Text fontWeight="normal">{t('appointment.detail.repeatDate', { appointmentCount: count, appointmentsTotal: total })}</Text>
                </HStack>
                <HStack space={2} alignItems="center">
                    <PersonIcon />
                    <Text fontWeight="normal">
                        {t('appointment.detail.participants', {
                            participantsTotal: attendeesCount,
                        })}
                    </Text>
                    <Pressable onPress={() => setShowModal(true)}>
                        <InformationBadge />
                    </Pressable>
                </HStack>
            </Stack>
            <Spacer py={3} />
            <Button
                width={`${buttonWidth}`}
                onPress={() => {
                    setShowVideoChat(true);
                }}
                isDisabled={!meetingId || !isWithinAppointmentTime(startDateTime, duration)}
            >
                {t('appointment.detail.videochatButton')}
            </Button>
            {meetingId && showVideoChat && <ZoomMeeting meetingId={meetingId} />}
        </>
    );
};

export default MetaDetails;
