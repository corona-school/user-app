import { Text, Box, Heading } from 'native-base';
import EmptyStateAppointments from '../assets/icons/lernfair/empty-state-appointments.svg';

type Props = {
    title: string;
    subtitle: string;
    isEnd?: boolean;
};

const AppointmentsEmptyState: React.FC<Props> = ({ title, subtitle }) => {
    return (
        <Box alignItems="center" justifyContent="center">
            <EmptyStateAppointments />
            <Heading>{title}</Heading>
            <Text maxW="300" textAlign="center" py="3">
                {subtitle}
            </Text>
        </Box>
    );
};
export default AppointmentsEmptyState;
