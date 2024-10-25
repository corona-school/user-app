import { DateTime } from 'luxon';
import { useCallback } from 'react';
import { getI18n } from 'react-i18next';
import { AppointmentParticipant, Organizer } from '../gql/graphql';
import AppointmentDate from './AppointmentDate';
import AppointmentTile from './AppointmentTile';
import { Appointment } from '../types/lernfair/Appointment';

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
    canJoinVideochat?: boolean;
    declinedBy: Appointment['declinedBy'];
};

export const canJoinMeeting = (start: string, duration: number, joinBeforeMinutes: number, now: DateTime): boolean => {
    const startDate = DateTime.fromISO(start).minus({ minutes: joinBeforeMinutes });
    const end = DateTime.fromISO(start).plus({ minutes: duration });
    return now.toUnixInteger() >= startDate.toUnixInteger() && now.toUnixInteger() <= end.toUnixInteger();
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
    canJoinVideochat,
    declinedBy,
}) => {
    const isCurrentMonth = useCallback((start: string): boolean => {
        const now = DateTime.now();
        const startDate = DateTime.fromISO(start);
        const sameMonth = now.hasSame(startDate, 'month');
        const sameYear = now.hasSame(startDate, 'year');
        return sameMonth && sameYear;
    }, []);

    const getAppointmentTimeText = (start: string, duration: number): string => {
        const now = DateTime.now();
        const startDate = DateTime.fromISO(start);
        const end = startDate.plus({ minutes: duration });

        const startTime = startDate.setLocale('de-DE').toFormat('T');
        const endTime = end.setLocale('de-DE').toFormat('T');
        const i18n = getI18n();

        if (startDate <= now && now <= end) {
            return i18n.t('appointment.clock.nowToEnd', { end: endTime });
        }
        return i18n.t('appointment.clock.startToEnd', { start: startTime, end: endTime });
    };

    const isCurrent = canJoinMeeting(start, duration, isOrganizer ? 240 : 10, DateTime.now());
    const currentMonth = isCurrentMonth(start);

    const wasRejected = !!participants?.every((e) => declinedBy?.includes(e.userID!));

    return (
        <>
            {!isReadOnly && organizers && participants ? (
                <div key={start} ref={scrollToRef} style={{ scrollMarginTop: currentMonth ? 50 : 100 }}>
                    <div className="w-[80%] lg:w-full mt-6">
                        <div className="flex">
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
                                wasRejected={wasRejected}
                                declinedBy={declinedBy}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <div key={start} ref={scrollToRef} style={{ scrollMarginTop: currentMonth ? 40 : 100 }}>
                    <div className="w-[80%] lg:w-full mt-6">
                        <div className="flex">
                            <AppointmentDate current={isCurrent} date={start} isReadOnly={isReadOnly} />

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
                                isReadOnly={isReadOnly}
                                appointmentId={appointmentId}
                                wasRejected={wasRejected}
                                declinedBy={declinedBy}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AppointmentDay;
