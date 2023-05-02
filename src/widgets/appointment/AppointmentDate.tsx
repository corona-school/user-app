import { DateTime } from 'luxon';
import { Text, Box } from 'native-base';

type Props = {
    current: boolean;
    date: string;
    color?: string;
};

const AppointmentDate: React.FC<Props> = ({ current, date, color }) => {
    return (
        <Box bg={current ? 'primary.100' : 'none'} p={2} borderRadius={5} alignItems="center" height="50%" mr="2">
            <Text fontSize="xs" color={color ? color : 'black'}>
                {DateTime.fromISO(date).setLocale('de').toFormat('ccc')}.
            </Text>
            <Text fontSize="md" bold color={color ? color : 'black'}>
                {DateTime.fromISO(date).setLocale('de').toFormat('dd')}
            </Text>
        </Box>
    );
};

export default AppointmentDate;
