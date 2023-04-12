import { Dispatch, SetStateAction, useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Box, Center, Divider, Text, useBreakpointValue, FlatList } from 'native-base';
import { DateTime } from 'luxon';
import { Appointment } from '../../types/lernfair/Appointment';
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner';
import AppointmentDay from './AppointmentDay';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AppointmentsEmptyState from '../AppointmentsEmptyState';
import { ScrollDirection } from '../../pages/Appointments';
import { NativeScrollEvent, NativeSyntheticEvent, ViewToken } from 'react-native';

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

const AppointmentList: React.FC<Props> = ({ appointments, isReadOnlyList, noNewAppointments, isLoadingAppointments, loadMoreAppointments }) => {
    const [isAtTop, setIsAtTop] = useState<boolean>(false);
    const navigate = useNavigate();
    const { t } = useTranslation();
    const scrollViewRef = useRef<HTMLElement>(null);

    // * required if scrolling to first appointment in list and load past data
    const viewabilityConfig = {
        itemVisiblePercentThreshold: 0.1,
    };

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

    const handleScrollTop = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        if (e.nativeEvent.contentOffset.y <= 2) setIsAtTop(true);
    };

    // TODO load past appointments
    // const handleViewableChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    //     if (viewableItems.some((item) => Number(item.key) === appointments[0].id)) handleLoadPast();
    //     return;
    // }, []);

    const handleLoadMore = () => {
        loadMoreAppointments && loadMoreAppointments(appointments[appointments.length - 1].id, 'next');
    };

    const handleLoadPast = useCallback(() => {
        loadMoreAppointments && isAtTop && loadMoreAppointments(appointments[0].id, 'last');
    }, [appointments, isAtTop, loadMoreAppointments]);

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
        return <></>;
    };

    // TODO use Header if scrolling to top
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
        if (isReadOnlyList) return;
        return handleScroll(scrollViewRef.current);
    }, []);

    // TODO remove if scroll past appointments is working
    // useEffect(() => {
    //     if (!isAtTop) return;
    //     return handleLoadPast;
    // }, [handleLoadPast, isAtTop]);

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
            onScroll={!isReadOnlyList ? handleScrollTop : undefined}
            viewabilityConfig={viewabilityConfig}
            // * use for load past appointments
            // ListHeaderComponent={!isReadOnlyList ? renderHeader : undefined}
            // ListHeaderComponent={renderHeader}
            // onViewableItemsChanged={handleViewableChanged}
        />
    );
};

export default AppointmentList;
