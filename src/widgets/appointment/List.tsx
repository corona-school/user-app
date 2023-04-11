import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Box, Center, Divider, Text, useBreakpointValue, FlatList } from 'native-base';

import { DateTime } from 'luxon';
import { Appointment } from '../../types/lernfair/Appointment';
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner';
import AppointmentDay from './AppointmentDay';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AppointmentsEmptyState from '../AppointmentsEmptyState';
import { ScrollDirection } from '../../pages/Appointments';
import { FlatList as FL, NativeScrollEvent, NativeSyntheticEvent, ViewToken } from 'react-native';

type Props = {
    appointments: Appointment[];
    isReadOnlyList: boolean;
    noNewAppointments?: boolean;
    isLoadingAppointments?: boolean;
    loadMoreAppointments?: (cursor: number, direction: ScrollDirection) => void;
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

const InfiniteScrollList: React.FC<Props> = ({ appointments, isReadOnlyList, noNewAppointments, isLoadingAppointments, loadMoreAppointments }) => {
    const [isAtTop, setIsAtTop] = useState<boolean>(false);
    const navigate = useNavigate();
    const { t } = useTranslation();
    const listRef = useRef<FL>(null);
    const scrollViewRef = useRef<HTMLElement>(null);
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

    const handleViewableChanged = ({ viewableItems }: { viewableItems: ViewToken[] }) => {
        // TODO if my first element is part of the viewable content check for the id
        console.log('visible', viewableItems);
        if (viewableItems.some((item) => Number(item.key) === appointments[0].id)) console.log('YES is viewable');
        return;
    };

    const handleLoadMore = () => {
        loadMoreAppointments && loadMoreAppointments(appointments[appointments.length - 1].id, 'next');
    };

    const handleLoadPast = () => {
        loadMoreAppointments && loadMoreAppointments(appointments[0].id, 'last');
    };

    const renderFooter = () => {
        if (noNewAppointments)
            return (
                <Box h={1000} justifyContent="center">
                    <AppointmentsEmptyState title={t('appointment.empty.noFurtherAppointments')} subtitle={t('appointment.empty.noFurtherDesc')} />
                </Box>
            );
        if (isLoadingAppointments) {
            return (
                <Box h={50} justifyContent="center">
                    <CenterLoadingSpinner />
                </Box>
            );
        }
        return <></>;
    };

    const renderHeader = () => {
        if (!noNewAppointments) {
            return (
                <Box h={50} justifyContent="center">
                    <CenterLoadingSpinner />
                </Box>
            );
        }
        return <></>;
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

        if (isLoadingAppointments) return <CenterLoadingSpinner />;
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
                        key={appointment.title}
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

    useEffect(() => {
        if (scrollViewRef.current === null) return;
        return handleScroll(scrollViewRef.current);
    }, []);

    // useEffect(() => {
    //     listRef.current?.scrollToIndex({ animated: true, index: scrollId });
    // }, []);

    useEffect(() => {
        if (!isAtTop) return;
        return handleLoadPast;
    }, [handleLoadPast, isAtTop]);

    return (
        <FlatList
            keyExtractor={(item) => item.id.toString()}
            height={100}
            maxW={maxListWidth}
            ref={listRef}
            data={appointments}
            renderItem={renderItems}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.1}
            ListFooterComponent={renderFooter}
            ListHeaderComponent={renderHeader}
            onViewableItemsChanged={handleViewableChanged}
            // viewabilityConfigCallbackPairs={}
        />
    );
};

export default InfiniteScrollList;
