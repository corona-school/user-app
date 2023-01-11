import { Info } from 'luxon';
import { Box, Center, Divider, Text } from 'native-base';
import { useMemo } from 'react';
import { Week } from '../../types/lernfair/Appointment';
import CalendarWeek from './CalendarWeek';

type MonthProps = {
    year: number;
    month: number;
    appointmentsOfMonth: Week;
    scrollToRef: any;
};

const CalendarMonth: React.FC<MonthProps> = ({ year, month, appointmentsOfMonth, scrollToRef }) => {
    const appointmentsForOneWeek = useMemo(() => Object.entries(appointmentsOfMonth), [appointmentsOfMonth]);
    const values = 1;

    return (
        <Box mt={2}>
            <Center>
                <Text>{`${Info.months('long', { locale: 'de-DE' })[Number(month) - 1]} ${year}`}</Text>
            </Center>
            <Divider my={3} />
            {appointmentsForOneWeek.map((weekEntries, idx) => {
                const appointmentsInWeek = weekEntries[values];
                return (
                    <CalendarWeek appointmentsOfWeek={appointmentsInWeek} lastOfMonth={idx === appointmentsForOneWeek.length - 1} scrollToRef={scrollToRef} />
                );
            })}
        </Box>
    );
};

export default CalendarMonth;
