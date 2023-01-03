import { DateTime } from 'luxon';

const getCourseTime = (courseStart: string, duration: number): string => {
    const now = DateTime.now();
    const start = DateTime.fromISO(courseStart);
    const ende = start.plus({ minutes: duration });
    const startTime = start.setLocale('de-DE').toFormat('T');
    const endTime = ende.setLocale('de-DE').toFormat('T');

    if (start.startOf('minute') === now.startOf('minute')) {
        return `Jetzt - ${endTime} Uhr`;
    } else if (start.startOf('minute') > now.startOf('minute')) {
        return `${startTime} - ${endTime} Uhr`;
    } else {
        return 'Vorbei';
    }
};

const getCourseDay = (courseDate: string) => {
    const courseDay = DateTime.fromISO(courseDate).setLocale('de').toFormat('ccc');
    const courseDateDay = DateTime.fromISO(courseDate).setLocale('de').toFormat('dd');
    return { courseDay, courseDateDay };
};

export { getCourseTime, getCourseDay };
