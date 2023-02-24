import { Box, ScrollView, useBreakpointValue } from 'native-base';
import appointments from './dummy/appointments';
import CalendarYear from './appointment-list/CalendarYear';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getScrollToId } from '../../helper/appointment-helper';

type ListProps = {
    appointments?: any;
    isReadOnly: boolean;
};

const AppointmentList: React.FC<ListProps> = ({ isReadOnly }) => {
    // TODO: observer überarbeiten
    const containerRef = useRef(null);
    const currentCourseRef = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState<boolean>(false);

    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 1.0,
    };

    const callbackFn = (entries: IntersectionObserverEntry[]) => {
        const [entry] = entries;
        setIsVisible(entry.isIntersecting);
    };

    // TODO change to data from BE
    // const { data: appointments, loading, error } = useQuery(appointmentsQuery);

    const allAppointments = appointments.monthAppointments;

    const handleScroll = (element: HTMLElement) => {
        element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'end' });
    };

    const listWidth = useBreakpointValue({
        base: '100%',
        lg: isReadOnly ? '100%' : '80%',
    });

    const scrollToCourseId = useMemo(() => {
        const id = getScrollToId();
        return id;
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(callbackFn, options);
        if (containerRef.current) observer.observe(containerRef.current);
        return () => {
            if (containerRef.current) observer.unobserve(containerRef.current);
        };
    }, []);

    useEffect(() => {
        if (currentCourseRef.current === null) return;
        if (isVisible) return handleScroll(currentCourseRef.current);
        if (!isReadOnly) return handleScroll(currentCourseRef.current);
        return;
    }, [isVisible]);

    const appointmentsForOneYear = useMemo(() => Object.entries(allAppointments), [allAppointments]);
    const yearIndex = 0;
    const appointmentsIndex = 1;

    return (
        <>
            {isReadOnly ? (
                <ScrollView ml={3} width={'100%'} pl={isReadOnly ? 0 : 3}>
                    {appointmentsForOneYear.map((yearEntries) => {
                        const year = Number(yearEntries[yearIndex]);
                        const appointmentsInYear = yearEntries[appointmentsIndex];
                        return (
                            <CalendarYear
                                key={year}
                                year={year}
                                appointmentsOfYear={appointmentsInYear}
                                scrollToRef={currentCourseRef}
                                scrollId={scrollToCourseId}
                                isReadOnly={isReadOnly}
                            />
                        );
                    })}
                </ScrollView>
            ) : (
                <Box ml={3} width={listWidth} pl={3}>
                    {appointmentsForOneYear.map((yearEntries) => {
                        const year = Number(yearEntries[yearIndex]);
                        const appointmentsInYear = yearEntries[appointmentsIndex];
                        return (
                            <CalendarYear
                                key={year}
                                year={year}
                                appointmentsOfYear={appointmentsInYear}
                                scrollToRef={currentCourseRef}
                                scrollId={scrollToCourseId}
                                isReadOnly={isReadOnly}
                            />
                        );
                    })}
                </Box>
            )}
            <div ref={containerRef} />
        </>
    );
};

export default AppointmentList;
