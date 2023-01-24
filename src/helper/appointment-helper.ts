import { getI18n } from 'react-i18next';
import { DateTime } from 'luxon';
import { AppointmentType } from '../types/lernfair/Appointment';
import appointments from '../widgets/appointment/dummy/appointments';

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

    return start <= now && now < end;
};

const getCourseTimeText = (courseStart: string, duration: number): string => {
    const now = DateTime.now();
    const start = DateTime.fromISO(courseStart);
    const end = start.plus({ minutes: duration });

    const startTime = start.setLocale('de-DE').toFormat('T');
    const endTime = end.setLocale('de-DE').toFormat('T');
    const i18n = getI18n();

    if (start <= now && now < end) {
        return i18n.t('appointment.clock.nowToEnd', { end: endTime });
    }
    return i18n.t('appointment.clock.startToEnd', { start: startTime, end: endTime });
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

const getNextCourseId = (appointments: AppointmentType[]): number => {
    const now = DateTime.now();
    const nextCourse = appointments.find((appointment) => {
        return DateTime.fromISO(appointment.startDate) > now;
    });
    return nextCourse?.id ?? 0;
};

const isCurrentMonth = (courseStart: string): boolean => {
    const now = DateTime.now();
    const start = DateTime.fromISO(courseStart);
    const sameMonth = now.hasSame(start, 'month');
    const sameYear = now.hasSame(start, 'year');
    if (sameMonth && sameYear) return true;
    return false;
};

const getScrollToId = (): number => {
    const currentId = appointments.currentCourseId;
    const nextId = appointments.nextCourseId;

    if (currentId) {
        return currentId;
    } else if (!currentId) {
        return nextId;
    }
    return 0;
};

export { getCourseDay, getAppointmentDateTime, isCurrentMonth, isCourseNow, getCourseTimeText, getNextCourseId, getScrollToId };
