import { VStack, Text, Box } from 'native-base';
import { useCallback } from 'react';
import { getCourseDay } from '../../helper/appointment-helper';

type Props = {
    current: boolean;
    date: string;
};
const AppointmentDate: React.FC<Props> = ({ current, date }) => {
    const day = useCallback(() => {
        return getCourseDay(date);
    }, [date]);

    return (
        <VStack h={40}>
            <Box bg={current ? 'primary.100' : 'none'} p={2} borderRadius={5}>
                <Text fontSize={'xs'}>{day().courseDay}.</Text>
                <Text fontSize={'md'} bold>
                    {day().courseDateDay}
                </Text>
            </Box>
        </VStack>
    );
};

export default AppointmentDate;
