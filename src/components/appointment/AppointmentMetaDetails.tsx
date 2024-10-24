import { Circle, HStack, VStack, Modal, Pressable, Spacer, Stack, Text, Tooltip, useBreakpointValue } from 'native-base';
import InformationBadge from '../notifications/preferences/InformationBadge';
import DateIcon from '../../assets/icons/lernfair/appointments/appointment_date.svg';
import TimeIcon from '../../assets/icons/lernfair/appointments/appointment_time.svg';
import PersonIcon from '../../assets/icons/lernfair/appointments/appointment_person.svg';
import RepeatIcon from '../../assets/icons/lernfair/appointments/appointment_repeat.svg';
import CamerIcon from '../../assets/icons/lf-camera-icon.svg';
import { useLayoutHelper } from '../../hooks/useLayoutHelper';
import { useTranslation } from 'react-i18next';
import AttendeesModal from '../../modals/AttendeesModal';
import { useMemo, useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { AppointmentParticipant, Lecture_Appointmenttype_Enum, Organizer } from '../../gql/graphql';
import { Appointment } from '../../types/lernfair/Appointment';
import { DateTime } from 'luxon';
import useInterval from '../../hooks/useInterval';
import VideoButton from '../VideoButton';
import { IconDeviceMobileMessage, IconPointFilled, IconArrowNarrowRight } from '@tabler/icons-react';
import { useCanJoinMeeting } from '@/hooks/useCanJoinMeeting';
import { QRCodeSVG } from 'qrcode.react';
import { gql } from '../../gql';

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
    const [loginURL, setLoginURL] = useState<string>('empty');
    const [, setCurrentTime] = useState(0);
    const { isMobile } = useLayoutHelper();
    const isMobilePhone = useBreakpointValue({
        base: true,
        sm: false,
    });
    const { t } = useTranslation();

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const canStartMeeting = useCanJoinMeeting(startDateTime, duration, isOrganizer ? 240 : 10, DateTime.now());

    useEffect(() => {
        canStartMeeting && createShortTimeLoginData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [createShortTimeLoginToken] = useMutation(
        gql(`
            mutation LoginTokenForSecondDevice($expiresAt: DateTime!, $description: String!) { tokenCreate(expiresAt: $expiresAt, description: $description) }
        `)
    );

    const createShortTimeLoginData = async () => {
        const expiresAt = DateTime.now().plus({ hours: 1 });
        const res = await createShortTimeLoginToken({ variables: { expiresAt: expiresAt, description: `` } });
        const token = res?.data?.tokenCreate;

        setLoginURL(
            process.env.NODE_ENV === 'production'
                ? `https://app.lern-fair.de/login-token?secret_token=${token}&temporary`
                : `http://localhost:3000/login-token?secret_token=${token}`
        );
    };

    return (
        <>
            <Modal isOpen={showModal} backgroundColor="transparent" onClose={() => setShowModal(false)}>
                <AttendeesModal organizers={organizers} participants={participants} declinedBy={declinedBy} onClose={() => setShowModal(false)} />
            </Modal>

            <HStack alignItems={'flex-start'} space={4} flexWrap="wrap" mt="-20px" flexShrink={1}>
                <VStack alignItems={'flex-start'} mt="20px" flexShrink={1}>
                    <Stack space={isMobile ? 5 : 7} alignItems="flex-start" flexWrap={'wrap'} flexShrink={1} direction={isMobile ? 'column' : 'row'} mt="-10px">
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
                    {appointmentId && appointmentType && (
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
                </VStack>
                {/* QR Code */}
                {canStartMeeting && !isMobilePhone && (
                    <HStack backgroundColor={'primary.100'} padding="16px" borderRadius="15px" space={4} mt="20px" flexWrap="wrap">
                        <VStack>
                            <HStack alignItems={'center'} space={2} mb={2} ml={-1}>
                                <IconDeviceMobileMessage />
                                <Text fontSize="sm" fontWeight={'bold'}>
                                    {t('appointment.detail.qrcode.title')}
                                </Text>
                            </HStack>
                            <Text fontSize="xs">{t('appointment.detail.qrcode.header')}</Text>
                            <HStack space={2} alignItems={'center'}>
                                <IconPointFilled size="6" />
                                <Text fontSize="xs">{t('appointment.detail.qrcode.bp1')}</Text>
                            </HStack>
                            <HStack space={2} alignItems={'center'}>
                                <IconPointFilled size="6" />
                                <Text fontSize="xs">{t('appointment.detail.qrcode.bp2')}</Text>
                            </HStack>
                            <HStack space={2} alignItems={'center'}>
                                <IconPointFilled size="6" />
                                <Text fontSize="xs">{t('appointment.detail.qrcode.bp3')}</Text>
                            </HStack>
                            <HStack space={2} alignItems={'center'} mt={2}>
                                <Text fontSize="xs">{t('appointment.detail.qrcode.footer')}</Text>
                                <IconArrowNarrowRight size="24" stroke={2} />
                            </HStack>
                        </VStack>
                        <VStack>
                            <QRCodeSVG value={loginURL} />
                        </VStack>
                    </HStack>
                )}
            </HStack>
        </>
    );
};

export default AppointmentMetaDetails;
