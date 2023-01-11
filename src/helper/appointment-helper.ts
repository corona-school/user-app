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

const isCourseInFuture = (courseStart: string, duration: number): boolean => {
    const { start, now } = getCourseTimes(courseStart, duration);

    if (start > now) {
        return true;
    } else {
        return false;
    }
};

const getCourseTimeText = (courseStart: string, duration: number): string => {
    const { start, now, end } = getCourseTimes(courseStart, duration);
    const startTime = start.setLocale('de-DE').toFormat('T');
    const endTime = end.setLocale('de-DE').toFormat('T');

    if (start > now) {
        return `${startTime} - ${endTime} Uhr`;
    } else if (start <= now && now < end) {
        return `Jetzt - ${endTime} Uhr`;
    } else if (now > end) {
        return `${startTime} - ${endTime} Uhr`;
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

export { getCourseDay, isCourseTakingPlaceRightNow, isCourseInFuture, getCourseTimeText };
