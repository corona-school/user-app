import { Box, useBreakpointValue } from 'native-base';
import appointments from './dummy/appointments';
import CalendarYear from './list/CalendarYear';
import { useEffect, useMemo, useRef } from 'react';
import { getScrollToId } from '../../helper/appointment-helper';

const AppointmentList: React.FC = () => {
    const currentCourseRef = useRef<HTMLElement>(null);
    // TODO change to data from BE
    const allAppointments = appointments.monthAppointments;

    const handleScroll = (element: HTMLElement) => {
        element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'end' });
    };

    const listWidth = useBreakpointValue({
        base: '100%',
        lg: '80%',
    });

    const scrollToCourseId = useMemo(() => {
        const id = getScrollToId();
        return id;
    }, []);

    useEffect(() => {
        if (currentCourseRef.current === null) return;
        return handleScroll(currentCourseRef.current);
    }, []);

    const appointmentsForOneYear = useMemo(() => Object.entries(allAppointments), [allAppointments]);
    const yearIndex = 0;
    const appointmentsIndex = 1;

    return (
        <Box ml={3} width={listWidth} pl={3}>
            {appointmentsForOneYear.map((yearEntries) => {
                const year = Number(yearEntries[yearIndex]);
                const appointmentsInYear = yearEntries[appointmentsIndex];
                return (
                    <CalendarYear key={year} year={year} appointmentsOfYear={appointmentsInYear} scrollToRef={currentCourseRef} scrollId={scrollToCourseId} />
                );
            })}
        </Box>
    );
};

export default AppointmentList;
