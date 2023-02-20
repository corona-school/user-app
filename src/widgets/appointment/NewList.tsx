import { DateTime } from 'luxon';
import { Box, Center, Divider, Text, VStack } from 'native-base';
import React, { useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getScrollToId } from '../../helper/appointment-helper';
import { AppointmentType } from '../../types/lernfair/Appointment';
import AppointmentDay from './AppointmentDay';
import { pupilsAppointments } from './dummy/testdata';

type Props = {
    appointments?: AppointmentType[];
};

const NewList: React.FC<Props> = ({}) => {
    const scrollViewRef = useRef(null);
    const navigate = useNavigate();

    const appointments = pupilsAppointments;

    const handleScroll = (element: HTMLElement) => {
        element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'end' });
    };

    const scrollToCourseId = useMemo(() => {
        const id = getScrollToId();
        return id;
    }, []);

    useEffect(() => {
        if (scrollViewRef.current === null) return;
        return handleScroll(scrollViewRef.current);
    }, []);

    const shouldRenderWeekDivider = (currentAppointment: AppointmentType, previousAppointment?: AppointmentType) => {
        if (!previousAppointment) {
            return false;
        }

        const currentDate = DateTime.fromISO(currentAppointment.start);
        const previousDate = DateTime.fromISO(previousAppointment.start);
        return currentDate.year !== previousDate.year || currentDate.weekNumber !== previousDate.weekNumber;
    };

    const shouldRenderMonthDivider = (currentAppointment: AppointmentType, previousAppointment?: AppointmentType) => {
        if (!previousAppointment) {
            return false;
        }

        const currentDate = DateTime.fromISO(currentAppointment.start);
        const previousDate = DateTime.fromISO(previousAppointment.start);
        return currentDate.month !== previousDate.month || currentDate.year !== previousDate.year;
    };

    return (
        <VStack flex={1}>
            {appointments.map((appointment, index) => {
                const previousAppointment = appointments[index - 1];
                const weekDivider = shouldRenderWeekDivider(appointment, previousAppointment);
                const monthDivider = shouldRenderMonthDivider(appointment, previousAppointment);

                return (
                    <Box key={appointment.id}>
                        {!monthDivider && weekDivider && <Divider my={3} width="95%" />}
                        {monthDivider && (
                            <Center mt="3">
                                <Text px={4}>`${DateTime.fromISO(appointment.start).monthLong} ${DateTime.fromISO(appointment.start).year}`</Text>
                                <Divider my={3} width="95%" />
                            </Center>
                        )}
                        <AppointmentDay
                            courseStart={appointment.start}
                            duration={appointment.duration}
                            courseTitle={appointment.title}
                            onPress={() => navigate(`/appointment/${appointment.id}`)}
                            scrollToRef={appointment.id === scrollToCourseId ? scrollViewRef : null}
                        />
                    </Box>
                );
            })}
        </VStack>
    );
};

export default NewList;
