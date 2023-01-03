import { DateTime } from 'luxon';

type returnCourseDate = {
    currentOrNot: boolean;
    timeText: string;
};

const isCourseCurrentOrNot = (courseStart: string, duration: number) => {
    const now = DateTime.now();
    const start = DateTime.fromISO(courseStart);
    const end = start.plus({ minutes: duration });
    const startTime = start.setLocale('de-DE').toFormat('T');
    const endTime = end.setLocale('de-DE').toFormat('T');

    let returnObject: returnCourseDate = {
        currentOrNot: false,
        timeText: '',
    };

    if (start > now) {
        returnObject.currentOrNot = false;
        returnObject.timeText = `${startTime} - ${endTime} Uhr`;
    } else if (start <= now && now < end) {
        returnObject.currentOrNot = true;
        returnObject.timeText = `Jetzt - ${endTime} Uhr`;
    } else if (now > end) {
        returnObject.currentOrNot = false;
        returnObject.timeText = `Vorbei`;
    } else {
        return returnObject;
    }
    return returnObject;
};

const getCourseDay = (courseDate: string) => {
    const courseDay = DateTime.fromISO(courseDate).setLocale('de').toFormat('ccc');
    const courseDateDay = DateTime.fromISO(courseDate).setLocale('de').toFormat('dd');
    return { courseDay, courseDateDay };
};

export { getCourseDay, isCourseCurrentOrNot };
