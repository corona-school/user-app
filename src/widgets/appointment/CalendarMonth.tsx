import { Info } from 'luxon';
import { Box, Center, Divider, Text } from 'native-base';
import CalendarWeek from './CalendarWeek';

type MonthProps = {
    year: string;
    month: string;
    appointments: any;
};

const CalendarMonth: React.FC<MonthProps> = ({ year, month, appointments }) => {
    return (
        <Box mt={2}>
            <Center>
                <Text>{`${Info.months('long', { locale: 'de-DE' })[Number(month) - 1]} ${year}`}</Text>
            </Center>
            <Divider my={3} />
            {Object.entries(appointments).map((week) => {
                return <CalendarWeek appointments={week[1]} />;
            })}
        </Box>
    );
};

export default CalendarMonth;
