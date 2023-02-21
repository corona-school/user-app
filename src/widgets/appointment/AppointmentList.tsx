import { DateTime } from 'luxon';
import { Box, Center, Divider, Text, VStack } from 'native-base';
import React, { useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Appointment } from '../../types/lernfair/Appointment';
import AppointmentDay from './AppointmentDay';
import { appointmentsData } from './dummy/testdata';

type Props = {
    appointments?: Appointment[];
    isReadOnly?: boolean;
};

const AppointmentList: React.FC<Props> = ({ appointments = appointmentsData, isReadOnly = false }) => {
    const scrollViewRef = useRef(null);
    const navigate = useNavigate();

    const isCourseNow = (courseStart: string, duration: number): boolean => {
        const now = DateTime.now();
        const start = DateTime.fromISO(courseStart);
        const end = start.plus({ minutes: duration });
        return start <= now && now < end;
    };

    const getScrollToId = (appointments: Appointment[]): number => {
        const now = DateTime.now();
        const next = appointments.find((appointment) => DateTime.fromISO(appointment.start) > now);
        const current = appointments.find((appointment) => isCourseNow(appointment.start, appointment.duration));
        const nextId = next?.id ?? 0;
        const currentId = current?.id;

        if (currentId) {
            return currentId;
        } else if (!currentId) {
            return nextId;
        }
        return 0;
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

    const scrollToCourseId = useMemo(() => {
        const id = getScrollToId(appointments);
        return id;
    }, []);

    useEffect(() => {
        if (scrollViewRef.current === null) return;
        return handleScroll(scrollViewRef.current);
    }, []);

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
                                courseStart={appointment.start}
                                duration={appointment.duration}
                                courseTitle={appointment.title}
                                organizers={appointment.organizers}
                                onPress={() => navigate(`/appointment/${appointment.id}`)}
                                scrollToRef={appointment.id === scrollToCourseId ? scrollViewRef : null}
                                isReadOnly={isReadOnly}
                            />
                        </Box>
                    </Box>
                );
            })}
        </VStack>
    );
};

export default AppointmentList;
