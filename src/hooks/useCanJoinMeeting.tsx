import { DateTime } from 'luxon';
import { useMemo, useState } from 'react';
import useInterval from './useInterval';

export const useCanJoinMeeting = (start: string, duration: number, joinBeforeMinutes: number) => {
    const [now, setNow] = useState(DateTime.now());

    useInterval(() => {
        setNow(DateTime.now());
    }, 60000);

    const valCanJoinMeeting = useMemo(() => canJoinMeeting(start, duration, joinBeforeMinutes, now), [duration, joinBeforeMinutes, start, now]) as boolean;

    return valCanJoinMeeting;
};

const canJoinMeeting = (start: string, duration: number, joinBeforeMinutes: number, now: DateTime): boolean => {
    if (start && duration) {
        const startDate = DateTime.fromISO(start).minus({ minutes: joinBeforeMinutes });
        const end = DateTime.fromISO(start).plus({ minutes: duration });
        return now.toUnixInteger() >= startDate.toUnixInteger() && now.toUnixInteger() <= end.toUnixInteger();
    } else {
        return false;
    }
};
