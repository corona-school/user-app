import { DateTime } from 'luxon';

const convertStartDate = (date: string, time: string): string => {
    const dt = DateTime.fromISO(date);
    const t = DateTime.fromISO(time);

    const newDate = dt.set({
        hour: t.hour,
        minute: t.minute,
        second: t.second,
    });
    return newDate.toISO();
};

const calcNewAppointmentInOneWeek = (date: string): string => {
    const startDate = DateTime.fromISO(date);
    const nextDate = startDate.plus({ days: 7 }).toISO();
    return nextDate;
};

const formatStart = (start: string): { date: string; time: string } => {
    const date = DateTime.fromISO(start).toFormat('yyyy-MM-dd');
    const time = DateTime.fromISO(start).toFormat('HH:mm:ss');
    return { date, time };
};

const isAppointmentNow = (start: string, duration: number): boolean => {
    const now = DateTime.now();
    const startDate = DateTime.fromISO(start);
    const end = startDate.plus({ minutes: duration });
    return startDate <= now && now < end;
};

export { convertStartDate, calcNewAppointmentInOneWeek, formatStart, isAppointmentNow };
