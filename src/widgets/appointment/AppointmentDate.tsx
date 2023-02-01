import { Text, Box } from 'native-base';
import { useCallback } from 'react';
import { getCourseDay } from '../../helper/appointment-helper';

type Props = {
    current: boolean;
    date: string;
    color?: string;
};
const AppointmentDate: React.FC<Props> = ({ current, date, color }) => {
    const day = useCallback(() => {
        return getCourseDay(date);
    }, [date]);

    return (
        <Box bg={current ? 'primary.100' : 'none'} p={2} borderRadius={5} alignItems="center">
            <Text fontSize="xs" color={color ? color : 'black'}>
                {day().courseDay}.
            </Text>
            <Text fontSize="md" bold color={color ? color : 'black'}>
                {day().courseDateDay}
            </Text>
        </Box>
    );
};

export default AppointmentDate;
