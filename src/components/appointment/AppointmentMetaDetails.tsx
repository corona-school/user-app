import { Circle, HStack, Modal, Pressable, Spacer, Stack, Text, Tooltip, useBreakpointValue } from 'native-base';
import InformationBadge from '../notifications/preferences/InformationBadge';
import DateIcon from '../../assets/icons/lernfair/appointments/appointment_date.svg';
import TimeIcon from '../../assets/icons/lernfair/appointments/appointment_time.svg';
import PersonIcon from '../../assets/icons/lernfair/appointments/appointment_person.svg';
import RepeatIcon from '../../assets/icons/lernfair/appointments/appointment_repeat.svg';
import CamerIcon from '../../assets/icons/lf-camera-icon.svg';
import { useLayoutHelper } from '../../hooks/useLayoutHelper';
import { useTranslation } from 'react-i18next';
import AttendeesModal from '../../modals/AttendeesModal';
import { useMemo, useState } from 'react';
import { AppointmentParticipant, Lecture_Appointmenttype_Enum, Organizer } from '../../gql/graphql';
import { Appointment } from '../../types/lernfair/Appointment';
import { DateTime } from 'luxon';
import useInterval from '../../hooks/useInterval';
import VideoButton from '../VideoButton';
import { useUserType } from '../../hooks/useApollo';

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
    appointmentId?: number;
    appointmentType?: Lecture_Appointmenttype_Enum;
    isOrganizer?: Appointment['isOrganizer'];
    overrideMeetingLink?: Appointment['override_meeting_link'];
    zoomMeetingUrl?: Appointment['zoomMeetingUrl'];
};
const AppointmentMetaDetails: React.FC<MetaProps> = ({
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
    appointmentId,
    appointmentType,
    isOrganizer,
    overrideMeetingLink,
    zoomMeetingUrl,
}) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [_, setCurrentTime] = useState(0);
    const { isMobile } = useLayoutHelper();
    const { t } = useTranslation();
    const userType = useUserType();

    const buttonWidth = useBreakpointValue({
        base: 'full',
        lg: '300',
    });
    useInterval(() => {
        setCurrentTime(new Date().getTime());
    }, 30_000);

    const isAppointmentOver = useMemo(() => {
        const end = DateTime.fromISO(startDateTime).plus({ minutes: duration + 15 });
        return end < DateTime.now();
    }, []);

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
            {(overrideMeetingLink || zoomMeetingUrl) && (
                <HStack space={2} alignItems="center">
                    <CamerIcon />
                    <Text fontWeight="normal">{overrideMeetingLink ?? zoomMeetingUrl?.split('?')[0]}</Text>
                    {zoomMeetingUrl && (
                        <Tooltip
                            maxWidth={270}
                            label={isOrganizer ? t('appointment.detail.zoomTooltipStudent') : t('appointment.detail.zoomTooltipPupil')}
                            bg={'primary.900'}
                            _text={{ textAlign: 'center' }}
                            p={3}
                            hasArrow
                            children={
                                <Circle rounded="full" bg="danger.100" size={4} ml={2}>
                                    <Text color={'white'}>i</Text>
                                </Circle>
                            }
                        ></Tooltip>
                    )}
                </HStack>
            )}
            <Spacer py={3} />
            {appointmentId && appointmentType && userType !== 'screener' && (
                <>
                    <VideoButton
                        isInstructor={isOrganizer}
                        appointmentId={appointmentId}
                        appointmentType={appointmentType}
                        startDateTime={startDateTime}
                        duration={duration}
                        buttonText={t('appointment.detail.videochatButton')}
                        width={buttonWidth}
                        isOver={isAppointmentOver}
                        overrideLink={overrideMeetingLink ?? undefined}
                    />
                </>
            )}
        </>
    );
};

export default AppointmentMetaDetails;
