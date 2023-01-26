import { Info } from 'luxon';
import { Box, Center, Divider, Text } from 'native-base';
import { useMemo } from 'react';
import { Week } from '../../types/lernfair/Appointment';
import CalendarWeek from './CalendarWeek';

type MonthProps = {
    key: React.Key;
    year: number;
    month: number;
    appointmentsOfMonth: Week;
    scrollToRef: any;
    scrollId: number;
};

const CalendarMonth: React.FC<MonthProps> = ({ year, month, appointmentsOfMonth, scrollToRef, scrollId }) => {
    const appointmentsForOneWeek = useMemo(() => Object.entries(appointmentsOfMonth), [appointmentsOfMonth]);
    const values = 1;

    return (
        <Box mb={5}>
            <Center>
                <Text>{`${Info.months('long', { locale: 'de-DE' })[Number(month) - 1]} ${year}`}</Text>
            </Center>
            <Divider my={3} width="95%" />
            {appointmentsForOneWeek.map((weekEntries, idx) => {
                const appointmentsInWeek = weekEntries[values];
                return (
                    <CalendarWeek
                        key={weekEntries[0]}
                        appointmentsOfWeek={appointmentsInWeek}
                        lastOfMonth={idx === appointmentsForOneWeek.length - 1}
                        scrollToRef={scrollToRef}
                        scrollId={scrollId}
                    />
                );
            })}
        </Box>
    );
};

export default CalendarMonth;
