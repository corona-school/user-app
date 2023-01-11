import { Box } from 'native-base';
import { useMemo } from 'react';
import { Month } from '../../types/lernfair/Appointment';
import CalendarMonth from './CalendarMonth';

type YearProps = {
    year: number;
    appointmentsOfYear: Month;
    scrollToRef: any;
};

const CalendarYear: React.FC<YearProps> = ({ year, appointmentsOfYear, scrollToRef }) => {
    const appointmentsForOneMonth = useMemo(() => Object.entries(appointmentsOfYear), [appointmentsOfYear]);
    const monthIndex = 0;
    const appointmentsIndex = 1;
    return (
        <Box>
            {appointmentsForOneMonth.map((monthEntries) => {
                const month = Number(monthEntries[monthIndex]);
                const appointmentInMonth = monthEntries[appointmentsIndex];
                return <CalendarMonth year={year} month={month} appointmentsOfMonth={appointmentInMonth} scrollToRef={scrollToRef} />;
            })}
        </Box>
    );
};

export default CalendarYear;
