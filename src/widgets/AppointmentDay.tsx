import { DateTime } from 'luxon';
import { useCallback } from 'react';
import { AppointmentParticipant, Organizer } from '@/gql/graphql';
import AppointmentTile from './AppointmentTile';
import { Appointment } from '@/types/lernfair/Appointment';
import { useCanJoinMeeting } from '@/hooks/useCanJoinMeeting';

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
    declinedBy: Appointment['declinedBy'];
    description?: Appointment['description'];
    onEdit?: () => void;
    onDuplicate?: () => void;
    onDelete?: () => void;
    clickable: boolean;
    editable: boolean;
};

const AppointmentDay: React.FC<Props> = ({
    start,
    duration,
    title,
    description,
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
    declinedBy,
    onEdit,
    onDuplicate,
    onDelete,
    clickable,
    editable,
}) => {
    const isCurrentMonth = useCallback((start: string): boolean => {
        const now = DateTime.now();
        const startDate = DateTime.fromISO(start);
        const sameMonth = now.hasSame(startDate, 'month');
        const sameYear = now.hasSame(startDate, 'year');
        return sameMonth && sameYear;
    }, []);

    const isCurrent = useCanJoinMeeting(isOrganizer ? 240 : 10, start, duration);
    const currentMonth = isCurrentMonth(start);

    const wasRejected = !!participants?.every((e) => declinedBy?.includes(e.userID!));

    return (
        <>
            {!isReadOnly && organizers && participants ? (
                <div key={start} ref={scrollToRef} style={{ scrollMarginTop: currentMonth ? 50 : 100 }}>
                    <div className="w-full mt-6">
                        <div className="flex">
                            <AppointmentTile
                                start={start}
                                duration={duration}
                                title={title}
                                description={description}
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
                                onEdit={onEdit}
                                onDuplicate={onDuplicate}
                                onDelete={onDelete}
                                clickable={clickable}
                                editable={editable}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <div key={start} ref={scrollToRef} style={{ scrollMarginTop: currentMonth ? 40 : 100 }}>
                    <div className="w-full mt-6">
                        <div className="flex">
                            <AppointmentTile
                                start={start}
                                duration={duration}
                                title={title}
                                description={description}
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
                                onEdit={onEdit}
                                onDuplicate={onDuplicate}
                                onDelete={onDelete}
                                clickable={clickable}
                                editable={editable}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AppointmentDay;
