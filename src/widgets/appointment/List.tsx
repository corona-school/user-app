import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Box, Center, Divider, Text, FlatList, ScrollView, Stack, useBreakpointValue, Container } from 'native-base';
import { DateTime } from 'luxon';
import { Appointment } from '../../types/lernfair/Appointment';
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner';
import AppointmentDay from './AppointmentDay';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AppointmentsEmptyState from '../AppointmentsEmptyState';

type Props = {
    appointments: Appointment[];
    isReadOnlyList: boolean;
    isLoadingAppointments?: boolean;
    isLoadingMoreAppointments?: boolean;
    loadMoreAppointments?: () => void;
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

const InfiniteScrollList: React.FC<Props> = ({ appointments, isReadOnlyList, isLoadingAppointments, isLoadingMoreAppointments, loadMoreAppointments }) => {
    const navigate = useNavigate();
    const scrollViewRef = useRef<HTMLElement>(null);
    const { t } = useTranslation();
    const [isListReady, setIsListReady] = useState<boolean>(false);

    const maxListWidth = useBreakpointValue({
        base: 'full',
        lg: isReadOnlyList ? 'full' : '90%',
    });

    const scrollId = useMemo(() => {
        return getScrollToId(appointments);
    }, [appointments]);

    const handleScroll = (element: HTMLElement) => {
        element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'end' });
    };

    const handleLoadMore = ({ distanceFromEnd }: { distanceFromEnd: number }) => {
        console.log('IF Statement', isLoadingAppointments);
        console.log('IF Statement', !isListReady);
        if (isLoadingAppointments || !isListReady) return;
        console.log('END OF LIST', distanceFromEnd);
        loadMoreAppointments && loadMoreAppointments();
    };

    const renderFooter = () => {
        // if (!isLoadingAppointments) return ;
        return <AppointmentsEmptyState title={t('appointment.empty.noFurtherAppointments')} subtitle={t('appointment.empty.noFurtherDesc')} />;
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

    const renderItems = ({ item: appointment, index }: { item: Appointment; index: number }) => {
        const previousAppointment = appointments[index - 1];
        const weekDivider = showWeekDivider(appointment, previousAppointment);
        const monthDivider = showMonthDivider(appointment, previousAppointment);

        return (
            <Box key={`${appointment.id + index}`} ml={3}>
                {!monthDivider && weekDivider && <Divider my={3} width="95%" />}
                {monthDivider && (
                    <>
                        <Center mt="3">
                            <Text>{`${DateTime.fromISO(appointment.start).setLocale('de').monthLong} ${DateTime.fromISO(appointment.start).year}`}</Text>
                        </Center>
                        <Divider my={3} width="95%" />
                    </>
                )}
                <Box ml={5}>
                    <AppointmentDay
                        key={appointment.id}
                        start={appointment.start}
                        duration={appointment.duration}
                        title={appointment.title}
                        organizers={appointment.organizers}
                        participants={appointment.participants}
                        onPress={() => navigate(`/appointment/${appointment.id}`)}
                        scrollToRef={appointment.id === scrollId ? scrollViewRef : null}
                        isReadOnly={isReadOnlyList}
                    />
                </Box>
            </Box>
        );
    };

    // useEffect(() => {
    //     // console.log('REF', scrollViewRef.current);
    //     if (scrollViewRef.current === null) return;
    //     return handleScroll(scrollViewRef.current);
    // }, []);

    return (
        <FlatList
            height={100}
            data={appointments}
            renderItem={renderItems}
            keyExtractor={(item) => item.id.toString()}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.2}
            ListFooterComponent={renderFooter}
            onScroll={() => {
                console.log('on state triggered');
                setIsListReady(true);
            }}
        />
    );
};

export default InfiniteScrollList;
