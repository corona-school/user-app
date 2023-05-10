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

const isDateMinOneWeekLater = (date: string): boolean => {
    const startDate = DateTime.fromISO(date);
    const diff = startDate.diffNow('days').days;
    if (diff >= 6) return true;
    return false;
};

const isDateToday = (dateString: string): boolean => {
    const date = DateTime.fromISO(dateString);
    const today = DateTime.local();
    const same = date.hasSame(today, 'day') && date.hasSame(today, 'month') && date.hasSame(today, 'year');
    return same;
};

const isTimeMinFiveMinutesLater = (date: string, time: string): boolean => {
    const convertedDate = convertStartDate(date, time);
    const start = DateTime.fromISO(convertedDate);
    let diff: number = 0;
    if (isDateToday(date)) diff = start.diffNow('minutes').minutes;
    if (diff >= 5) return true;
    return false;
};
export { convertStartDate, calcNewAppointmentInOneWeek, formatStart, isDateToday, isAppointmentNow, isDateMinOneWeekLater, isTimeMinFiveMinutesLater };
