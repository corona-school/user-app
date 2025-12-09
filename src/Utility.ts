import { TrafficStatus } from './types/lernfair/Course';
import { ClassRange } from './types/lernfair/SchoolClass';
import { DateTime } from 'luxon';
import { Course_Coursestate_Enum } from './gql/graphql';
import i18next from 'i18next';

export const TIME_THRESHOLD = 2 * 60 * 60 * 1000;
export const TOKEN_LENGTH = 32;
// eslint-disable-next-line no-restricted-globals
export const REDIRECT_PASSWORD = `/login`;
export const MIN_MAX_GRADE_RANGE = { min: 1, max: 14 };
export const TRAINEE_GRADE = 14;

export const toTimerString = (referenceDate: DateTime, theDate: DateTime) => {
    const inPast = theDate < referenceDate;
    let prefix = 'In';
    if (inPast) {
        prefix = 'Vor';
    }
    const days = Math.abs(theDate.startOf('day').diff(referenceDate.startOf('day'), 'days').days);

    if (days > 1 && days <= 14) return `${prefix} ${days} Tagen`;
    if (days > 14) return theDate.toLocaleString();

    if (days === 1) {
        return inPast ? 'Gestern' : `Morgen`;
    }

    const diff = Math.abs(theDate.toUnixInteger() - referenceDate.toUnixInteger());
    const hrs = Math.floor((diff / (60 * 60)) % 24);
    const mins = Math.floor((diff / 60) % 60);

    return `${prefix} ${hrs.toString().padStart(2, '0')} Stunden und ${mins.toString().padStart(2, '0')} Minuten`;
};

export const createToken = () => {
    const subLength = 8;

    if (!Number.isInteger(TOKEN_LENGTH / subLength)) {
        throw new Error('TOKEN_LENGTH must be dividable by 8');
    }

    let id = '';
    for (let i = 0; i < TOKEN_LENGTH / subLength; i++) {
        id += Math.random()
            .toString(36)
            .substring(2, 2 + subLength);
    }
    return id;
};

export const intToClassRange: (num: number) => ClassRange = (num: number) => {
    let minClass = 0;
    let maxClass = 0;

    switch (num) {
        case 1:
            minClass = 1;
            maxClass = 4;
            break;
        case 2:
            minClass = 5;
            maxClass = 8;
            break;
        case 3:
            minClass = 9;
            maxClass = 10;
            break;
        case 4:
            minClass = 11;
            maxClass = 13;
            break;
    }

    return { min: minClass, max: maxClass } as ClassRange;
};

export const findMinMaxClassRange: (nums: number[]) => ClassRange = (nums: number[]) => {
    let minClass = 13;
    let maxClass = 0;
    for (const n of nums) {
        const range = intToClassRange(n);
        if (range.min < minClass) minClass = range.min;
        if (range.max > maxClass) maxClass = range.max;
    }
    return { min: minClass, max: maxClass } as ClassRange;
};

export const getGradeLabel = (grade: number) => {
    if (grade === TRAINEE_GRADE) return i18next.t('inTraining');
    return i18next.t('lernfair.schoolclass', { class: grade });
};

export const formatDate: (date: Date | string, format?: Intl.DateTimeFormatOptions, locale?: string) => string = (
    date,
    format = DateTime.DATETIME_MED,
    locale
) => {
    if (!date) return '';

    return DateTime.fromISO(date.toString()).toLocaleString(format, { locale: locale ?? i18next.language });
};

export const handleDateString: (datetime: string, format: string, locale?: string, outputFormat?: Intl.DateTimeFormatOptions) => string = (
    datetime,
    format,
    locale = 'de',
    outputFormat = DateTime.DATETIME_MED
) => {
    return DateTime.fromFormat(datetime, format).toLocaleString(outputFormat, {
        locale,
    });
};

export const getTrafficStatus: (participants: number, maxParticipants: number) => TrafficStatus = (participants = 0, maxParticipants = 0) => {
    return participants >= maxParticipants ? 'full' : maxParticipants - participants <= 5 ? 'last' : 'free';
};

export const getTrafficStatusText = (subcourse: { course: { courseState?: Course_Coursestate_Enum }; published?: boolean; cancelled?: boolean }): string => {
    if (!subcourse.published) {
        if (subcourse.course.courseState === Course_Coursestate_Enum.Created) return i18next.t('single.global.courseState.draft');
        if (subcourse.course.courseState === Course_Coursestate_Enum.Submitted) return i18next.t('single.global.courseState.submitted');
        if (subcourse.course.courseState === Course_Coursestate_Enum.Allowed) return i18next.t('single.global.courseState.draft');
        if (subcourse.course.courseState === Course_Coursestate_Enum.Denied) return i18next.t('single.global.courseState.denied');
    }
    if (subcourse.published) {
        if (subcourse.cancelled) return i18next.t('single.global.courseState.cancelled');

        return i18next.t('single.global.courseState.publish');
    }
    return i18next.t('single.global.courseState.publish');
};

export const getTrafficLampText = (status: TrafficStatus, isStudent: boolean, seatsMax?: number, seatsFull?: number, seatsLeft?: number): string => {
    if (isStudent) return i18next.t('single.global.status.lastSeats', { seatsFull: seatsFull ?? 0, seatsMax: seatsMax ?? 0 });
    if (status === 'free') return i18next.t('single.global.status.free');
    if (status === 'last') return i18next.t('single.global.status.last', { seatsLeft: seatsLeft ?? 0 });
    if (status === 'full') return i18next.t('single.global.status.full');
    return i18next.t('single.global.status.full');
};

export const getTrafficLampColor = (status: TrafficStatus) => {
    const colors = {
        free: 'bg-primary',
        last: 'bg-secondary',
        full: 'bg-orange-500',
    };
    return colors[status];
};

export const sortByDate = <Subcourse extends { firstLecture?: { start: any } | null }>(arr: Subcourse[] | undefined) => {
    if (!arr) return [];
    return arr.sort((a, b) => {
        const aLecture = a.firstLecture;
        const bLecture = b.firstLecture;

        const aDate = aLecture?.start || 0;
        const bDate = bLecture?.start || 0;

        return aDate > bDate ? 1 : -1;
    });
};

export const renderTextWithEmailLinks = (text: string) => {
    const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
    return text.replace(emailRegex, '<a class="underline" href="mailto:$1">$1</a>');
};

export type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export const DAYS: Day[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export const fromMinutesOfTheDayToFormat = (minutesOfTheDay: number, format = 'HH:mm') => {
    return DateTime.now().startOf('day').plus({ minutes: minutesOfTheDay }).toFormat(format);
};

function fromFormatToMinutes(time: string) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}

export const TIME_SLOTS = [
    `${fromFormatToMinutes('10:00')}-${fromFormatToMinutes('11:00')}`,
    `${fromFormatToMinutes('11:00')}-${fromFormatToMinutes('12:00')}`,
    `${fromFormatToMinutes('12:00')}-${fromFormatToMinutes('13:00')}`,
    `${fromFormatToMinutes('13:00')}-${fromFormatToMinutes('14:00')}`,
    `${fromFormatToMinutes('14:00')}-${fromFormatToMinutes('15:00')}`,
    `${fromFormatToMinutes('15:00')}-${fromFormatToMinutes('16:00')}`,
    `${fromFormatToMinutes('16:00')}-${fromFormatToMinutes('17:00')}`,
    `${fromFormatToMinutes('17:00')}-${fromFormatToMinutes('18:00')}`,
    `${fromFormatToMinutes('18:00')}-${fromFormatToMinutes('19:00')}`,
    `${fromFormatToMinutes('19:00')}-${fromFormatToMinutes('20:00')}`,
    `${fromFormatToMinutes('20:00')}-${fromFormatToMinutes('21:00')}`,
];

const Utility = {
    createToken,
    toTimerString,
    TIME_THRESHOLD,
    intToClassRange,
    findMinMaxClassRange,
    formatDate,
    handleDateString,
    getTrafficStatus,
    sortByDate,
    renderTextWithEmailLinks,
};
export default Utility;
