import { Button, HStack, Spacer, Stack, Text, useBreakpointValue } from 'native-base';
import InformationBadge from '../notifications/preferences/InformationBadge';
import DateIcon from '../../assets/icons/lernfair/appointments/appointment_date.svg';
import TimeIcon from '../../assets/icons/lernfair/appointments/appointment_time.svg';
import PersonIcon from '../../assets/icons/lernfair/appointments/appointment_person.svg';
import RepeatIcon from '../../assets/icons/lernfair/appointments/appointment_repeat.svg';
import { useLayoutHelper } from '../../hooks/useLayoutHelper';
import { useTranslation } from 'react-i18next';

type MetaProps = {
    date: string;
    startTime: string;
    endTime: string;
    duration: number;
    count: number;
    total: number;
    attendeesCount?: number;
    meetingLink?: string;
};
const MetaDetails: React.FC<MetaProps> = ({ date, startTime, endTime, duration, count, total, attendeesCount, meetingLink }) => {
    const { isMobile } = useLayoutHelper();
    const { t } = useTranslation();

    const buttonWidth = useBreakpointValue({
        base: 'full',
        lg: '300',
    });
    return (
        <>
            <Stack direction={isMobile ? 'column' : 'row'} space={isMobile ? 5 : 7}>
                <HStack space={2} alignItems="center">
                    <DateIcon />
                    <Text fontWeight="normal">{date}</Text>
                </HStack>
                <HStack space={2} alignItems="center">
                    <TimeIcon />
                    <Text fontWeight="normal">{t('appointment.appointmentDetail.time', { start: startTime, end: endTime, duration: duration })}</Text>
                </HStack>
                <HStack space={2} alignItems="center">
                    <RepeatIcon />
                    <Text fontWeight="normal">{t('appointment.appointmentDetail.repeatDate', { appointmentCount: count, appointmentsTotal: total })}</Text>
                </HStack>
                <HStack space={2} alignItems="center">
                    <PersonIcon />
                    <Text fontWeight="normal">
                        {t('appointment.appointmentDetail.participants', {
                            participantsTotal: attendeesCount,
                        })}
                    </Text>
                    <InformationBadge />
                </HStack>
            </Stack>
            <Spacer py={3} />
            <Button width={buttonWidth} isDisabled={meetingLink ? false : true} onPress={() => window.open(meetingLink, '_blank')}>
                {t('appointment.appointmentDetail.videochatButton')}
            </Button>
        </>
    );
};

export default MetaDetails;
