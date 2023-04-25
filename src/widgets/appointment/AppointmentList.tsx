import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Box, Center, Divider, Text, useBreakpointValue, FlatList, Button } from 'native-base';
import { DateTime } from 'luxon';
import { Appointment } from '../../types/lernfair/Appointment';
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner';
import AppointmentDay from './AppointmentDay';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AppointmentsEmptyState from '../AppointmentsEmptyState';
import { ScrollDirection } from '../../pages/Appointments';
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { useOnScreen } from '../../hooks/useIntersectionObserver';

type Props = {
    appointments: Appointment[];
    isReadOnlyList: boolean;
    noNewAppointments?: boolean;
    noOldAppointments?: boolean;
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

const AppointmentList: React.FC<Props> = ({
    appointments,
    isReadOnlyList,
    noNewAppointments,
    noOldAppointments,
    isLoadingAppointments,
    loadMoreAppointments,
}) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const scrollViewRef = useRef<HTMLElement>(null);

    const maxListWidth = useBreakpointValue({
        base: 'full',
        lg: isReadOnlyList ? 'full' : '90%',
    });
    const scrollId = useMemo(() => {
        return getScrollToId(appointments);
    }, [appointments]);

    const handleScrollIntoView = (element: HTMLElement) => {
        element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'end' });
    };

    const handleLoadMore = () => {
        loadMoreAppointments && loadMoreAppointments(appointments[appointments.length - 1].id, 'next');
    };

    const handleLoadPast = useCallback(() => {
        loadMoreAppointments && loadMoreAppointments(appointments[0].id, 'last');
    }, [appointments, loadMoreAppointments]);

    const renderFooter = () => {
        if (noNewAppointments || appointments.length === 0)
            return (
                <Box py={5} justifyContent="center">
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
        return null;
    };

    const renderHeader = () => {
        if (noOldAppointments) return null;
        if (isLoadingAppointments) {
            return (
                <Box h={50} justifyContent="center">
                    <CenterLoadingSpinner />
                </Box>
            );
        }
        return (
            <Box py={5} justifyContent="center" alignItems="center">
                <Button variant="outline" onPress={handleLoadPast} width="25%">
                    {t('appointment.loadPastAppointments')}
                </Button>
            </Box>
        );
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
                        key={appointment.id}
                        start={appointment.start}
                        duration={appointment.duration}
                        title={appointment.title}
                        organizers={appointment.organizers}
                        participants={appointment.participants}
                        onPress={() => navigate(`/appointment/${appointment.id}`)}
                        scrollToRef={appointment.id === scrollId ? scrollViewRef : null}
                        isReadOnly={isReadOnlyList}
                        appointmentType={appointment.appointmentType}
                        position={appointment.position}
                        total={appointment.total}
                        isOrganizer={appointment.isOrganizer}
                        displayName={appointment.displayName}
                    />
                </Box>
            </Box>
        );
    };

    useEffect(() => {
        if (scrollViewRef.current === null) return;
        if (isReadOnlyList) return;
        return handleScrollIntoView(scrollViewRef.current);
    }, []);

    return (
        <FlatList
            keyExtractor={(item) => item.id.toString()}
            height={100}
            maxW={maxListWidth}
            data={appointments}
            renderItem={renderItems}
            onEndReached={!isReadOnlyList ? handleLoadMore : undefined}
            onEndReachedThreshold={0.1}
            ListFooterComponent={!isReadOnlyList ? renderFooter : undefined}
            ListHeaderComponent={!isReadOnlyList ? renderHeader : undefined}
        />
    );
};

export default AppointmentList;
