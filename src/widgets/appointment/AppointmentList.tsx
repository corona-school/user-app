import { Box, useBreakpointValue } from 'native-base';
import appointments from './dummy/appointments';
import CalendarYear from './CalendarYear';
import { useEffect, useMemo, useRef } from 'react';

const AppointmentList: React.FC = () => {
    const currentCourseRef = useRef(null);
    console.log(currentCourseRef);
    const allAppointments = appointments.monthAppointments;
    const width = useBreakpointValue({
        base: '100%',
        lg: '90%',
    });

    const handleScroll = (ref: { offsetTop: number }) => {
        window.scrollTo({
            top: ref.offsetTop + 75,
            left: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        if (currentCourseRef.current === null) return;
        return handleScroll(currentCourseRef.current);
    }, []);

    const appointmentsForOneYear = useMemo(() => Object.entries(allAppointments), [allAppointments]);
    const yearIndex = 0;
    const appointmentsIndex = 1;

    return (
        <Box width={width}>
            {appointmentsForOneYear.map((yearEntries) => {
                const year = Number(yearEntries[yearIndex]);
                const appointmentsInYear = yearEntries[appointmentsIndex];
                return <CalendarYear year={year} appointmentsOfYear={appointmentsInYear} scrollToRef={currentCourseRef} />;
            })}
        </Box>
    );
};

export default AppointmentList;
