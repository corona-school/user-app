import { Box } from 'native-base';
import { useMemo } from 'react';
import { Month } from '../../../types/lernfair/Appointment';
import CalendarMonth from './CalendarMonth';

type YearProps = {
    key: React.Key;
    year: number;
    appointmentsOfYear: Month;
    scrollToRef?: any;
    scrollId?: number;
    isReadOnly?: boolean;
};

const CalendarYear: React.FC<YearProps> = ({ year, appointmentsOfYear, scrollToRef, scrollId, isReadOnly }) => {
    const appointmentsForOneMonth = useMemo(() => Object.entries(appointmentsOfYear), [appointmentsOfYear]);
    const monthIndex = 0;
    const appointmentsIndex = 1;

    return (
        <Box>
            {appointmentsForOneMonth.map((monthEntries) => {
                const month = Number(monthEntries[monthIndex]);
                const appointmentInMonth = monthEntries[appointmentsIndex];
                return (
                    <CalendarMonth
                        key={`${year}-${month}`}
                        year={year}
                        month={month}
                        appointmentsOfMonth={appointmentInMonth}
                        scrollToRef={scrollToRef}
                        scrollId={scrollId}
                        isReadOnly={isReadOnly}
                    />
                );
            })}
        </Box>
    );
};

export default CalendarYear;
