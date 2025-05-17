import React, { useMemo, useRef, useEffect, useCallback } from 'react';
import { DateTime } from 'luxon';
import { Appointment } from '../types/lernfair/Appointment';
import AppointmentDay from './AppointmentDay';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AppointmentsEmptyState from './AppointmentsEmptyState';
import { ScrollDirection } from '../pages/Appointments';
import { isAppointmentNow } from '../helper/appointment-helper';
import useInterval from '../hooks/useInterval';
import { Button } from '@/components/Button';
import { Typography } from '@/components/Typography';
import { Separator } from '@/components/Separator';
import InfiniteScroll from 'react-infinite-scroll-component';
import { cn } from '@/lib/Tailwind';
import CenterLoadingSpinner from '@/components/CenterLoadingSpinner';

interface HeaderProps {
    hasMoreOldAppointments: boolean;
    isLoading: boolean;
    onLoadMoreOldAppointments: () => void;
}

const Header = ({ hasMoreOldAppointments, isLoading, onLoadMoreOldAppointments }: HeaderProps) => {
    const { t } = useTranslation();
    if (!hasMoreOldAppointments) return null;
    return (
        <div className="flex pb-10 justify-center items-center">
            <Button variant="outline" onClick={onLoadMoreOldAppointments} isLoading={isLoading}>
                {t('appointment.loadPastAppointments')}
            </Button>
        </div>
    );
};

interface FooterProps {
    hasMoreAppointments: boolean;
    isLoading: boolean;
}

const Footer = ({ hasMoreAppointments, isLoading }: FooterProps) => {
    const { t } = useTranslation();
    if (!hasMoreAppointments && !isLoading)
        return (
            <div className="flex justify-center py-5">
                <AppointmentsEmptyState title={t('appointment.empty.noFurtherAppointments')} subtitle={t('appointment.empty.noFurtherDesc')} />
            </div>
        );
    return null;
};

interface AppointmentItemProps {
    appointment: Appointment;
    previousAppointment?: Appointment;
    index: number;
    isReadOnly: boolean;
}

const AppointmentItem = React.memo(({ appointment, previousAppointment, index, isReadOnly }: AppointmentItemProps) => {
    const navigate = useNavigate();
    const { i18n } = useTranslation();
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

    const monthDivider = showMonthDivider(appointment, previousAppointment);
    return (
        <div>
            {monthDivider && (
                <>
                    <div className="flex items-center justify-center mt-3">
                        <Typography>{`${DateTime.fromISO(appointment.start).setLocale(i18n.language).monthLong} ${
                            DateTime.fromISO(appointment.start).year
                        }`}</Typography>
                    </div>
                    <Separator className="my-3 w-full" />
                </>
            )}
            <div>
                <AppointmentDay
                    start={appointment.start}
                    duration={appointment.duration}
                    title={appointment.title}
                    description={appointment.description}
                    organizers={appointment.organizers}
                    participants={appointment.participants}
                    onPress={() => navigate(`/appointment/${appointment.id}`)}
                    isReadOnly={isReadOnly}
                    isFullWidth
                    appointmentType={appointment.appointmentType}
                    position={appointment.position}
                    total={appointment.total}
                    isOrganizer={appointment.isOrganizer}
                    displayName={appointment.displayName}
                    appointmentId={appointment.id}
                    declinedBy={appointment.declinedBy}
                />
            </div>
        </div>
    );
});

type AppointmentListProps = {
    appointments: Appointment[];
    isReadOnlyList: boolean;
    disableScroll?: boolean;
    isFullWidth?: boolean;
    noNewAppointments?: boolean;
    noOldAppointments?: boolean;
    isLoadingAppointments?: boolean;
    loadMoreAppointments?: (skip: number, cursor: number, direction: ScrollDirection) => void;
    lastAppointmentId?: number | null;
    height?: number | string;
};

const getScrollToId = (appointments: Appointment[]): number => {
    if (!appointments) return 0;
    const now = DateTime.now();
    const next = appointments.find((appointment) => DateTime.fromISO(appointment.start) > now);
    const current = appointments.find((appointment) => isAppointmentNow(appointment.start, appointment.duration));
    const nextId = next?.id ?? 0;
    const currentId = current?.id;

    return currentId || nextId;
};
const AppointmentList = ({
    appointments,
    isReadOnlyList,
    disableScroll = false,
    isFullWidth,
    noNewAppointments,
    noOldAppointments,
    isLoadingAppointments,
    loadMoreAppointments,
    lastAppointmentId,
    height = 100,
}: AppointmentListProps) => {
    const scrollViewRef = useRef<HTMLElement>(null);

    const scrollId = useMemo(() => {
        return getScrollToId(appointments);
    }, [appointments]);

    const handleScrollIntoView = (element: HTMLElement) => {
        element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'end' });
    };

    const handleLoadMore = () => {
        loadMoreAppointments && loadMoreAppointments(1, appointments[appointments.length - 1]?.id, 'next');
    };

    const handleLoadPast = useCallback(() => {
        if (loadMoreAppointments && appointments.length > 0) {
            loadMoreAppointments(1, appointments[0].id, 'last');
        } else {
            loadMoreAppointments && lastAppointmentId && loadMoreAppointments(0, lastAppointmentId, 'last');
        }
    }, [appointments, loadMoreAppointments, lastAppointmentId]);

    const [_, setRefresh] = React.useState(0);

    useInterval(() => {
        setRefresh(new Date().getTime());
    }, 60_000);

    useEffect(() => {
        if (scrollViewRef.current === null) return;
        if (isReadOnlyList || disableScroll) return;
        return handleScrollIntoView(scrollViewRef.current);
    }, [isReadOnlyList, scrollId]);

    const canLoadMoreAppointments = !isReadOnlyList && !noNewAppointments && !isLoadingAppointments;
    const isFullHeight = height === '100%';
    return (
        <div
            id="scrollable"
            style={{ height: height }}
            className={cn('flex flex-col overflow-scroll w-full lg:max-w-full', isFullHeight ? 'flex-1 basis-0 max-h-full' : '')}
        >
            <InfiniteScroll
                scrollableTarget="scrollable"
                dataLength={appointments.length}
                next={handleLoadMore}
                hasMore={canLoadMoreAppointments}
                loader={
                    <div className="my-4">
                        <CenterLoadingSpinner />
                    </div>
                }
                endMessage={<Footer hasMoreAppointments={!noNewAppointments} isLoading={!!isLoadingAppointments} />}
            >
                <Header hasMoreOldAppointments={!noOldAppointments} isLoading={!!isLoadingAppointments} onLoadMoreOldAppointments={handleLoadPast} />
                {appointments.map((appointment, index) => (
                    <AppointmentItem
                        key={appointment.id}
                        appointment={appointment}
                        previousAppointment={appointments[index - 1]}
                        index={index}
                        isReadOnly={isReadOnlyList}
                    />
                ))}
            </InfiniteScroll>
        </div>
    );
};

export default AppointmentList;
