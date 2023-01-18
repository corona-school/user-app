import { getI18n } from 'react-i18next';

import { DateTime } from 'luxon';

type AppointmentDates = {
    date: string;
    startTime: string;
    endTime: string;
};

const getAppointmentDateTime = (appointmentStart: string, duration?: number): AppointmentDates => {
    const start = DateTime.fromISO(appointmentStart);
    const date = start.setLocale('de').toFormat('dd. LLLL yyyy');
    const startTime = start.setLocale('de').toFormat('HH:mm');
    const end = start.plus({ minutes: duration });
    const endTime = end.setLocale('de').toFormat('HH:mm');

    return { date, startTime, endTime };
};

const isCourseNow = (courseStart: string, duration: number): boolean => {
    const now = DateTime.now();
    const start = DateTime.fromISO(courseStart);
    const end = start.plus({ minutes: duration });

    if (start > now) {
        return false;
    } else if (start <= now && now < end) {
        return true;
    } else if (now > end) {
        return false;
    } else {
        return false;
    }
};

const getCourseTimeText = (courseStart: string, duration: number): string => {
    const now = DateTime.now();
    const start = DateTime.fromISO(courseStart);
    const end = start.plus({ minutes: duration });
    const startTime = start.setLocale('de-DE').toFormat('T');
    const endTime = end.setLocale('de-DE').toFormat('T');
    const i18n = getI18n();

    if (start > now) {
        return i18n.t('appointment.clock.startToEnd', { start: startTime, end: endTime });
    } else if (start <= now && now < end) {
        return i18n.t('appointment.clock.nowToEnd', { end: endTime });
    } else if (now > end) {
        return i18n.t('appointment.clock.startToEnd', { start: startTime, end: endTime });
    } else {
        return '';
    }
};

type CourseDay = {
    courseDay: string;
    courseDateDay: string;
};

const getCourseDay = (courseDate: string): CourseDay => {
    const courseDay = DateTime.fromISO(courseDate).setLocale('de').toFormat('ccc');
    const courseDateDay = DateTime.fromISO(courseDate).setLocale('de').toFormat('dd');
    return { courseDay, courseDateDay };
};

export { getCourseDay, isCourseNow, getCourseTimeText, getAppointmentDateTime };
