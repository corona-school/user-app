import { DateTime } from 'luxon';
import { Box, Center, Divider, Text, VStack } from 'native-base';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Appointment } from '../../types/lernfair/Appointment';
import AppointmentDay from './AppointmentDay';

type Props = {
    appointments: Appointment[];
    isReadOnly?: boolean;
};

const isAppointmentNow = (start: string, duration: number): boolean => {
    const now = DateTime.now();
    const startDate = DateTime.fromISO(start);
    const end = startDate.plus({ minutes: duration });
    return startDate <= now && now < end;
};
const getScrollToId = (appointments: Appointment[]): number => {
    const now = DateTime.now();
    const next = appointments.find((appointment) => DateTime.fromISO(appointment.start) > now);
    const current = appointments.find((appointment) => isAppointmentNow(appointment.start, appointment.duration));
    const nextId = next?.id ?? 0;
    const currentId = current?.id;

    return currentId || nextId || 0;
};

const AppointmentList: React.FC<Props> = ({ appointments = [], isReadOnly = false }) => {
    const containerRef = useRef(null);
    const scrollViewRef = useRef(null);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const navigate = useNavigate();

    const scrollId = useMemo(() => {
        return getScrollToId(appointments);
    }, [appointments]);

    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 1.0,
    };

    const callbackFn = (entries: IntersectionObserverEntry[]) => {
        const [entry] = entries;
        setIsVisible(entry.isIntersecting);
    };

    const handleScroll = (element: HTMLElement) => {
        element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'end' });
    };

    const showWeekDivider = (currentAppointment: Appointment, previousAppointment?: Appointment) => {
        if (!previousAppointment) {
            return false;
        }

        const currentDate = DateTime.fromISO(currentAppointment.start);
        const previousDate = DateTime.fromISO(previousAppointment.start);
        return currentDate.year !== previousDate.year || currentDate.weekNumber !== previousDate.weekNumber;
    };

    const showMonthDivider = (currentAppointment: Appointment, previousAppointment?: Appointment) => {
        if (!previousAppointment) {
            return true;
        }

        const currentDate = DateTime.fromISO(currentAppointment.start);
        const previousDate = DateTime.fromISO(previousAppointment.start);
        return currentDate.month !== previousDate.month || currentDate.year !== previousDate.year;
    };

    useEffect(() => {
        const observer = new IntersectionObserver(callbackFn, options);
        if (containerRef.current) observer.observe(containerRef.current);
        return () => {
            if (containerRef.current) observer.unobserve(containerRef.current);
        };
    }, []);

    useEffect(() => {
        if (scrollViewRef.current === null) return;
        if (isVisible) return handleScroll(scrollViewRef.current);
        if (!isReadOnly) return handleScroll(scrollViewRef.current);
        return;
    }, [appointments, isVisible]);

    return (
        <VStack flex={1} maxW={isReadOnly ? 'full' : '90%'}>
            {appointments.map((appointment, index) => {
                const previousAppointment = appointments[index - 1];
                const weekDivider = showWeekDivider(appointment, previousAppointment);
                const monthDivider = showMonthDivider(appointment, previousAppointment);

                return (
                    <Box key={appointment.id} ml={3}>
                        {!monthDivider && weekDivider && <Divider my={3} width="95%" />}
                        {monthDivider && (
                            <>
                                <Center mt="3">
                                    <Text>{`${DateTime.fromISO(appointment.start).setLocale('de').monthLong} ${
                                        DateTime.fromISO(appointment.start).year
                                    }`}</Text>
                                </Center>
                                <Divider my={3} width="95%" />
                            </>
                        )}
                        <Box ml={5}>
                            <AppointmentDay
                                key={`appointment-${index}`}
                                start={appointment.start}
                                duration={appointment.duration}
                                title={appointment.title}
                                organizers={appointment.organizers}
                                onPress={() => navigate(`/appointment/${appointment.id}`)}
                                scrollToRef={appointment.id === scrollId ? scrollViewRef : null}
                                isReadOnly={isReadOnly}
                            />
                        </Box>
                    </Box>
                );
            })}
            <div ref={containerRef} />
        </VStack>
    );
};

export default AppointmentList;
