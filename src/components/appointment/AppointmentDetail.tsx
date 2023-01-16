import { Avatar, Box, Button, Divider, Heading, HStack, Spacer, Stack, Text, useBreakpointValue, useTheme, useToast, VStack } from 'native-base';
import { useTranslation } from 'react-i18next';
import { useLayoutHelper } from '../../hooks/useLayoutHelper';
import InformationBadge from '../notifications/preferences/InformationBadge';
import DateIcon from '../../assets/icons/lernfair/appointments/appointment_date.svg';
import TimeIcon from '../../assets/icons/lernfair/appointments/appointment_time.svg';
import PersonIcon from '../../assets/icons/lernfair/appointments/appointment_person.svg';
import RepeatIcon from '../../assets/icons/lernfair/appointments/appointment_repeat.svg';
import StudentAvatar from '../../assets/icons/lernfair/avatar_student.svg';
import PupilAvatar from '../../assets/icons/lernfair/avatar_pupil.svg';
import { getAppointmentDateTime } from '../../helper/appointment-helper';
import { useCallback, useState } from 'react';

type AppointmentDetailProps = {
    id: number;
    instructors: string[];
    participants: string[];
    appointmentTitle: string;
    startDate: string;
    duration: number;
    courseTitle?: string;
    description?: string;
    appointmentType?: string;
    appointmentsCount?: number;
    appointmentsTotal?: number;
    userType?: string;
    meetingLink?: string;
};
const AppointmentDetail: React.FC<AppointmentDetailProps> = ({
    id,
    instructors,
    participants,
    appointmentTitle,
    startDate,
    duration,
    courseTitle,
    description,
    appointmentType,
    appointmentsCount,
    appointmentsTotal,
    userType,
    meetingLink,
}) => {
    const { isMobile } = useLayoutHelper();
    const { t } = useTranslation();
    const toast = useToast();
    const { sizes } = useTheme();
    const [canceled, setCanceled] = useState<boolean>(false);

    const buttonWidth = useBreakpointValue({
        base: 'full',
        lg: '300',
    });

    const containerWidth = useBreakpointValue({
        base: 'full',
        lg: sizes['containerWidth'],
    });

    const containerMargin = useBreakpointValue({
        base: 'auto',
        lg: 5,
    });

    const cancelAppointment = useCallback(() => {
        toast.show({ description: t('appointments.appointmentDetail.canceledToast'), placement: 'top' });
        setCanceled(true);
        // TODO mutation: declinedBy.push(participant)
    }, []);

    const { date, startTime, endTime } = getAppointmentDateTime(startDate, duration);

    return (
        <Box marginX={containerMargin} maxW={containerWidth}>
            {/* Avatare  */}
            <HStack py={5}>
                <Avatar.Group _avatar={{ size: 'md' }} space={-2} max={5}>
                    {instructors
                        ?.map((i) => <Avatar key={i}>{<StudentAvatar style={{ margin: '-1' }} />}</Avatar>)
                        .concat(participants?.map((i) => <Avatar key={i}>{<PupilAvatar style={{ margin: '-20' }} />}</Avatar>) ?? [])}
                </Avatar.Group>
            </HStack>

            {/* Header  */}
            <VStack space={2}>
                <Text color="primary.600" fontWeight="normal">
                    {t(
                        appointmentType === 'GROUP'
                            ? 'appointments.appointmentDetail.group'
                            : appointmentType === 'ONE_TO_ONE'
                            ? 'appointments.appointmentDetail.oneToOne'
                            : 'appointments.appointmentDetail.without',
                        {
                            instructor: instructors?.join(', '),
                        }
                    )}
                </Text>
                <Heading fontSize="3xl" fontWeight="normal" color="primary.900">
                    {t('appointments.appointmentDetail.appointmentTitle', { appointmentTitle: appointmentTitle })}
                </Heading>
                {appointmentType === 'GROUP' && (
                    <Text color="primary.600" fontWeight="normal">
                        {t('appointments.appointmentDetail.courseTitle', { courseTitle: courseTitle })}
                    </Text>
                )}
            </VStack>
            <Divider thickness="0.25" my={5} />

            {/* Meta Details  */}
            <Stack direction={isMobile ? 'column' : 'row'} space={isMobile ? 5 : 7}>
                <HStack space={2} alignItems="center">
                    <DateIcon />
                    <Text fontWeight="normal">{date}</Text>
                </HStack>
                <HStack space={2} alignItems="center">
                    <TimeIcon />
                    <Text fontWeight="normal">{t('appointments.appointmentDetail.time', { start: startTime, end: endTime, duration: duration })}</Text>
                </HStack>
                <HStack space={2} alignItems="center">
                    <RepeatIcon />
                    <Text fontWeight="normal">
                        {t('appointments.appointmentDetail.repeatDate', { appointmentCount: appointmentsCount, appointmentsTotal: appointmentsTotal })}
                    </Text>
                </HStack>
                <HStack space={2} alignItems="center">
                    <PersonIcon />
                    <Text fontWeight="normal">
                        {t('appointments.appointmentDetail.participants', { participantsTotal: participants.length + instructors.length })}
                    </Text>
                    <InformationBadge />
                </HStack>
            </Stack>
            <Spacer py={3} />
            <Button width={buttonWidth} isDisabled={meetingLink ? false : true} onPress={() => window.open(meetingLink, '_blank')}>
                {t('appointments.appointmentDetail.videochatButton')}
            </Button>

            {/* Description */}
            <Divider thickness="0.25" my={5} />
            {description && (
                <>
                    <VStack p={3}>
                        <Text color="primary.900" mb="2">
                            {t(
                                appointmentType === 'GROUP'
                                    ? 'appointments.appointmentDetail.courseDescriptionHeader'
                                    : 'appointments.appointmentDetail.desciptionHeader',
                                { courseTitle: courseTitle }
                            )}
                        </Text>
                        <Text color="primary.600" fontWeight="normal">
                            {description}
                        </Text>
                    </VStack>
                    <Divider thickness="0.25" my={5} />
                </>
            )}

            {/* Button Section */}
            <Stack direction={isMobile ? 'column' : 'row'} space={3}>
                {userType === 'student' && (
                    <>
                        <Button _text={{ color: 'white' }} bgColor="amber.700" width={buttonWidth}>
                            {t('appointments.appointmentDetail.deleteButton')}
                        </Button>
                        <Button variant="outline" width={buttonWidth}>
                            {t('appointments.appointmentDetail.editButton')}
                        </Button>
                    </>
                )}
                {userType === 'pupil' && (
                    <Button _text={{ color: 'white' }} bgColor="amber.700" width={buttonWidth} onPress={cancelAppointment} isDisabled={canceled}>
                        {t('appointments.appointmentDetail.cancelButton')}
                    </Button>
                )}
            </Stack>
        </Box>
    );
};

export default AppointmentDetail;
