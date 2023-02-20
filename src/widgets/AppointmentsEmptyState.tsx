import { Text, Box, Heading } from 'native-base';
import EmptyStateAppointments from '../assets/icons/lernfair/empty-state-appointments.svg';

type Props = {
    title: string;
    subtitle: string;
    isEnd?: boolean;
};

const AppointmentEmptyState: React.FC<Props> = ({ title, subtitle, isEnd }) => {
    return (
        <Box alignItems="center" justifyContent="center" h={isEnd ? 800 : 'full'}>
            <EmptyStateAppointments />
            <Heading>{title}</Heading>
            <Text maxW="300" textAlign="center" py="3">
                {subtitle}
            </Text>
        </Box>
    );
};
export default AppointmentEmptyState;
