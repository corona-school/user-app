import { DateTime } from 'luxon';
import { AppointmentType } from '../types/lernfair/Appointment';
import appointments from '../widgets/appointment/dummy/appointments';

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

const getNextCourseId = (appointments: AppointmentType[]): number => {
    const now = DateTime.now();
    const nextCourse = appointments.find((appointment) => {
        console.log(DateTime.fromISO(appointment.startDate) > now);
        return DateTime.fromISO(appointment.startDate) > now;
    });
    return nextCourse?.id ?? 0;
};

const getScrollToId = (): number => {
    const currentId = appointments.currentCourseId;
    const nextId = appointments.nextCourseId;

    if (currentId) {
        console.log('current ' + currentId);
        return currentId;
    } else if (!currentId) {
        console.log('next ' + nextId);
        return nextId;
    }
    return 0;
};

export { getCourseDay, isCourseTakingPlaceRightNow, getCourseTimeText, getNextCourseId, getScrollToId };
