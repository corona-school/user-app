import { DateTime } from 'luxon';
import { Box, HStack, useBreakpointValue } from 'native-base';
import { useCallback } from 'react';
import { getI18n } from 'react-i18next';
import { AppointmentParticipant, Organizer } from '../../gql/graphql';
import AppointmentDate from './AppointmentDate';
import AppointmentTile from './AppointmentTile';
import { Appointment } from '../../types/lernfair/Appointment';

type Props = {
    start: string;
    duration: number;
    title: string;
    organizers?: Organizer[];
    participants?: AppointmentParticipant[];
    scrollToRef?: any;
    isReadOnly?: boolean;
    isFullWidth?: boolean;
    onPress: () => void;
    appointmentType: Appointment['appointmentType'];
    position: Appointment['position'];
    total: Appointment['total'];
    isOrganizer: Appointment['isOrganizer'];
    displayName: Appointment['displayName'];
    appointmentId: Appointment['id'];
};

const AppointmentDay: React.FC<Props> = ({
    start,
    duration,
    title,
    organizers,
    participants,
    scrollToRef,
    isReadOnly,
    isFullWidth,
    onPress,
    appointmentType,
    position,
    total,
    isOrganizer,
    displayName,
    appointmentId,
}) => {
    const isCurrentMonth = useCallback((start: string): boolean => {
        const now = DateTime.now();
        const startDate = DateTime.fromISO(start);
        const sameMonth = now.hasSame(startDate, 'month');
        const sameYear = now.hasSame(startDate, 'year');
        return sameMonth && sameYear;
    }, []);

    const isAppointmentNow = (start: string, duration: number): boolean => {
        const now = DateTime.now();
        const startDate = DateTime.fromISO(start);
        const end = startDate.plus({ minutes: duration });

        return startDate <= now && now < end;
    };

    const getAppointmentTimeText = (start: string, duration: number): string => {
        const now = DateTime.now();
        const startDate = DateTime.fromISO(start);
        const end = startDate.plus({ minutes: duration });

        const startTime = startDate.setLocale('de-DE').toFormat('T');
        const endTime = end.setLocale('de-DE').toFormat('T');
        const i18n = getI18n();

        if (startDate <= now && now < end) {
            return i18n.t('appointment.clock.nowToEnd', { end: endTime });
        }
        return i18n.t('appointment.clock.startToEnd', { start: startTime, end: endTime });
    };

    const isCurrent = isAppointmentNow(start, duration);
    const currentMonth = isCurrentMonth(start);

    const width = useBreakpointValue({
        base: '80%',
        lg: '100%',
    });

    return (
        <>
            {!isReadOnly && organizers && participants ? (
                <div key={start} ref={scrollToRef} style={{ scrollMarginTop: currentMonth ? 40 : 100 }}>
                    <Box w={width} mt={3}>
                        <HStack>
                            <AppointmentDate current={isCurrent} date={start} />
                            <AppointmentTile
                                timeDescriptionText={getAppointmentTimeText(start, duration)}
                                title={title}
                                isCurrentlyTakingPlace={isCurrent}
                                organizers={organizers}
                                participants={participants}
                                isReadOnly={isReadOnly}
                                isFullWidth={isFullWidth}
                                onPress={onPress}
                                appointmentType={appointmentType}
                                position={position}
                                total={total}
                                isOrganizer={isOrganizer}
                                displayName={displayName}
                                appointmentId={appointmentId}
                            />
                        </HStack>
                    </Box>
                </div>
            ) : (
                <div key={start} ref={scrollToRef} style={{ scrollMarginTop: currentMonth ? 40 : 100 }}>
                    <Box w={width} mt={3}>
                        <HStack>
                            <AppointmentDate current={isCurrent} date={start} />
                            <AppointmentTile
                                timeDescriptionText={getAppointmentTimeText(start, duration)}
                                title={title}
                                isCurrentlyTakingPlace={isCurrent}
                                appointmentType={appointmentType}
                                position={position}
                                total={total}
                                onPress={onPress}
                                isOrganizer={isOrganizer}
                                displayName={displayName}
                            />
                        </HStack>
                    </Box>
                </div>
            )}
        </>
    );
};

export default AppointmentDay;
