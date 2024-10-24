import { DateTime } from 'luxon';
import { useMemo } from 'react';

export const useCanJoinMeeting = (start: string, duration: number, joinBeforeMinutes: number, now: DateTime, canJoin?: boolean) => {
    const valCanJoinMeeting = useMemo(
        () => canJoinMeeting(start, duration, joinBeforeMinutes, now, canJoin),
        [canJoin, duration, joinBeforeMinutes, start, now]
    ) as boolean;

    return valCanJoinMeeting;
};

const canJoinMeeting = (start: string, duration: number, joinBeforeMinutes: number, now: DateTime, canJoin?: boolean): boolean => {
    if (canJoin) {
        return true;
    } else if (start && duration) {
        const startDate = DateTime.fromISO(start).minus({ minutes: joinBeforeMinutes });
        const end = DateTime.fromISO(start).plus({ minutes: duration });
        return now.toUnixInteger() >= startDate.toUnixInteger() && now.toUnixInteger() <= end.toUnixInteger();
    } else {
        return false;
    }
};
