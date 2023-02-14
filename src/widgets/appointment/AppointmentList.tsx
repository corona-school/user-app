import { Box, ScrollView, useBreakpointValue } from 'native-base';
import appointments from './dummy/appointments';
import CalendarYear from './appointment-list/CalendarYear';
import { useEffect, useMemo, useRef } from 'react';
import { getScrollToId } from '../../helper/appointment-helper';

type ListProps = {
    appointments?: any;
    isReadOnly: boolean;
};

const AppointmentList: React.FC<ListProps> = ({ isReadOnly: isStatic }) => {
    const currentCourseRef = useRef<HTMLElement>(null);
    // TODO change to data from BE
    // const { data: appointments, loading, error } = useQuery(appointmentsQuery);

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
        <>
            {isStatic ? (
                <ScrollView ml={3} width={'100%'} pl={isStatic ? 0 : 3}>
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
                                isReadOnly={isStatic}
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
                                isReadOnly={isStatic}
                            />
                        );
                    })}
                </Box>
            )}
        </>
    );
};

export default AppointmentList;
