import { Lecture } from '@/gql/graphql';
import { DateTime } from 'luxon';
import { useMemo, useState } from 'react';
import useInterval from './useInterval';

interface UseCanJoinMeetingProps {
    joinBeforeMinutes: number;
    appointment: Pick<Lecture, 'start' | 'duration'>;
}

export const useCanJoinMeeting = ({ joinBeforeMinutes, appointment }: UseCanJoinMeetingProps) => {
    const [now, setNow] = useState(DateTime.now());

    useInterval(() => {
        setNow(DateTime.now());
    }, 60000);

    const canJoinMeeting = useMemo(() => {
        const end = DateTime.fromISO(appointment.start).plus({ minutes: appointment.duration });
        const isAppointmentInTheFuture = DateTime.now() <= end;
        // Allow users to join meetings that are already over. (only if it was in the last 30 days).
        if (!isAppointmentInTheFuture && DateTime.fromISO(appointment.start).diffNow('days').days > -30) return true;

        if (appointment.start && appointment.duration) {
            const startDate = DateTime.fromISO(appointment.start).minus({ minutes: joinBeforeMinutes });
            const end = DateTime.fromISO(appointment.start).plus({ minutes: appointment.duration });
            return now.toUnixInteger() >= startDate.toUnixInteger() && now.toUnixInteger() <= end.toUnixInteger();
        } else {
            return false;
        }
    }, [appointment.duration, joinBeforeMinutes, appointment.start, now]) as boolean;

    return canJoinMeeting;
};
