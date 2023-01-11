import { getI18n } from 'react-i18next';

import { DateTime } from 'luxon';

type CourseTimes = {
    start: DateTime;
    end: DateTime;
    now: DateTime;
};
const getCourseTimes = (courseStart: string, duration: number): CourseTimes => {
    const now = DateTime.now();
    const start = DateTime.fromISO(courseStart);
    const end = start.plus({ minutes: duration });
    return { start, end, now };
};

const isCourseTakingPlaceRightNow = (courseStart: string, duration: number): boolean => {
    const { start, end, now } = getCourseTimes(courseStart, duration);

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
    const { start, now, end } = getCourseTimes(courseStart, duration);
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

export { getCourseDay, isCourseTakingPlaceRightNow, getCourseTimeText };
