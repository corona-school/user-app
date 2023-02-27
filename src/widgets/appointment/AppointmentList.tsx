import { DateTime } from 'luxon';
import { Box, Center, Divider, ScrollView, Stack, Text, useBreakpointValue } from 'native-base';
import React, { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Appointment } from '../../types/lernfair/Appointment';
import AppointmentsEmptyState from '../AppointmentsEmptyState';
import AppointmentDay from './AppointmentDay';

type Props = {
    appointments: Appointment[];
    isReadOnly?: boolean;
    isEndOfList?: boolean;
    setEndOfList?: Dispatch<SetStateAction<boolean>>;
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
const AppointmentList: React.FC<Props> = ({ appointments = [], isReadOnly, isEndOfList, setEndOfList }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    // const startContainerRef = useRef<HTMLDivElement>(null);
    const scrollViewRef = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const maxListWidth = useBreakpointValue({
        base: 'full',
        lg: isReadOnly ? 'full' : '90%',
    });

    const emptyStateH = useBreakpointValue({
        base: '60%',
        lg: 1200,
    });

    const scrollId = useMemo(() => {
        return getScrollToId(appointments);
    }, [appointments]);

    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 1.0,
    };

    const callbackFn = (entries: IntersectionObserverEntry[]) => {
        if (isEndOfList) return;
        const [entry] = entries;
        setIsVisible(entry.isIntersecting);
        setEndOfList && setEndOfList(entry.isIntersecting);
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
    }, [containerRef.current, options]);

    useEffect(() => {
        if (scrollViewRef.current === null) return;
        if (isVisible) return handleScroll(scrollViewRef.current);
        if (!isReadOnly) return handleScroll(scrollViewRef.current);
        return;
    }, [appointments, isReadOnly, isVisible]);

    return (
        <>
            {/* <div ref={startContainerRef} /> */}
            <ScrollView scrollEnabled={isReadOnly}>
                <Stack flex={1} maxW={maxListWidth}>
                    <>
                        {appointments.map((appointment, index) => {
                            const previousAppointment = appointments[index - 1];
                            const weekDivider = showWeekDivider(appointment, previousAppointment);
                            const monthDivider = showMonthDivider(appointment, previousAppointment);

                            return (
                                <Box key={`${appointment.id + index}`} ml={3}>
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
                                            key={`appointment-${appointment.title}-start-${appointment.id}`}
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
                        {/* //TODO only show when no future appointments (refetching by scrolling...) */}
                        {!isReadOnly && isEndOfList && (
                            <Box alignItems="center" justifyContent="center" h={emptyStateH}>
                                <AppointmentsEmptyState title={t('appointment.empty.noFurtherAppointments')} subtitle={t('appointment.empty.noFurtherDesc')} />
                            </Box>
                        )}
                    </>
                </Stack>
            </ScrollView>
            <div ref={containerRef} />
        </>
    );
};

export default AppointmentList;
