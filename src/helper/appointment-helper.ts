import { DateTime } from 'luxon';

type courseDate = {
    currentOrNot: boolean;
    timeText: string;
};

const getCourseDate = (courseStart: string, duration: number) => {
    const now = DateTime.now();
    const start = DateTime.fromISO(courseStart);
    const end = start.plus({ minutes: duration });
    const startTime = start.setLocale('de-DE').toFormat('T');
    const endTime = end.setLocale('de-DE').toFormat('T');

    let courseDate: courseDate = {
        currentOrNot: false,
        timeText: '',
    };

    if (start > now) {
        courseDate.currentOrNot = false;
        courseDate.timeText = `${startTime} - ${endTime} Uhr`;
    } else if (start <= now && now < end) {
        courseDate.currentOrNot = true;
        courseDate.timeText = `Jetzt - ${endTime} Uhr`;
    } else if (now > end) {
        courseDate.currentOrNot = false;
        courseDate.timeText = `${startTime} - ${endTime} Uhr`;
    } else {
        return courseDate;
    }
    return courseDate;
};

const getCourseDay = (courseDate: string) => {
    const courseDay = DateTime.fromISO(courseDate).setLocale('de').toFormat('ccc');
    const courseDateDay = DateTime.fromISO(courseDate).setLocale('de').toFormat('dd');
    return { courseDay, courseDateDay };
};

export { getCourseDay, getCourseDate };
