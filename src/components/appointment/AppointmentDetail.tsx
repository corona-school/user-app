import { Avatar, Box, Button, Divider, Heading, HStack, Spacer, Stack, Text, useBreakpointValue, VStack } from 'native-base';
import { useTranslation } from 'react-i18next';
import { useLayoutHelper } from '../../hooks/useLayoutHelper';
import InformationBadge from '../notifications/preferences/InformationBadge';
import DateIcon from '../../assets/icons/lernfair/appointments/appointment_date.svg';
import TimeIcon from '../../assets/icons/lernfair/appointments/appointment_time.svg';
import PersonIcon from '../../assets/icons/lernfair/appointments/appointment_person.svg';
import RepeatIcon from '../../assets/icons/lernfair/appointments/appointment_repeat.svg';

type AppointmentDetailProps = {
    id: number;
    instructors: string[];
    participants: string[];
    appointmentTitle: string;
    title: string;
    description: string;
    startDate: string;
    duration: number;
    appointmentsCount?: number;
};
const AppointmentDetail: React.FC<AppointmentDetailProps> = ({
    id,
    instructors,
    participants,
    appointmentTitle,
    title,
    description,
    startDate,
    duration,
    appointmentsCount,
}) => {
    const { isMobile } = useLayoutHelper();
    const { t } = useTranslation();

    const buttonWidth = useBreakpointValue({
        base: 'full',
        lg: '300',
    });
    return (
        <Box>
            <HStack py={5}>
                <Avatar.Group max={6}>
                    <Avatar />
                    <Avatar />
                    <Avatar />
                    <Avatar />
                    <Avatar />
                    <Avatar />
                    <Avatar />
                    <Avatar />
                </Avatar.Group>
            </HStack>
            <VStack space={2}>
                <Text color="primary.600">{t('appointments.singleAppointment.group')}</Text>
                <Heading fontSize="3xl" color="primary.900">
                    Lektion 3: Algebra
                </Heading>
                <Text color="primary.600">Kurs: Grundlagen Tutorium</Text>
            </VStack>
            <Divider my={3} />
            <Stack direction={isMobile ? 'column' : 'row'} space={isMobile ? 4 : 7}>
                <HStack space={2} alignItems="center">
                    <DateIcon />
                    <Text>02. Januar 2023</Text>
                </HStack>
                <HStack space={2} alignItems="center">
                    <TimeIcon />
                    <Text>10:00 - 11:00 Uhr (60 Minuten)</Text>
                </HStack>
                <HStack space={2} alignItems="center">
                    <RepeatIcon />
                    <Text>3. von insgesamt 5 Terminen</Text>
                </HStack>
                <HStack space={2} alignItems="center">
                    <PersonIcon />
                    <Text> 4 Teilnehmer:innen</Text>
                    <InformationBadge />
                </HStack>
            </Stack>
            <Spacer py={3} />
            <Button width={buttonWidth}>Jetzt Videochat beitreten</Button>
            <Divider my={3} />
            <VStack p={3}>
                <Text color="primary.900" mb="2">
                    Kursbeschreibung: Grundlagen
                </Text>
                <Text color="primary.600">
                    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed
                    diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
                </Text>
            </VStack>
            <Divider my={3} />
            <Stack direction={isMobile ? 'column' : 'row'} space={3}>
                <Button _text={{ color: 'white' }} bgColor="amber.700" width={buttonWidth}>
                    Termin löschen
                </Button>
                {/* <Button _text={{ color: 'white' }} bgColor="amber.700" width={buttonWidth}>
                    Termin absagen
                </Button> */}

                <Button variant="outline" width={buttonWidth}>
                    Termin bearbeiten
                </Button>
            </Stack>
        </Box>
    );
};

export default AppointmentDetail;
