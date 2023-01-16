import { Box, useBreakpointValue } from 'native-base';
import appointments from './dummy/appointments';
import CalendarYear from './CalendarYear';
import { useEffect, useMemo, useRef } from 'react';
import { getScrollToId } from '../../helper/appointment-helper';

function getOffsetTopOfParents(parent: Element | null): number {
    let offset = 0;
    if (!parent) {
        return offset;
    }
    const p = (parent as HTMLElement).offsetParent;
    offset = (parent as HTMLElement).offsetTop + getOffsetTopOfParents(p);
    return offset;
}

const AppointmentList: React.FC = () => {
    const currentCourseRef = useRef<HTMLElement>(null);
    const allAppointments = appointments.monthAppointments;
    const width = useBreakpointValue({
        base: '100%',
        lg: '90%',
    });

    const handleScroll = (element: HTMLElement) => {
        window.scrollTo({
            top: element.offsetTop + getOffsetTopOfParents(element.offsetParent),
            left: 0,
            behavior: 'smooth',
        });
    };

    const scrollToCourseId = useMemo(() => {
        const id = getScrollToId();
        console.log(id);
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
        <Box width={width}>
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
