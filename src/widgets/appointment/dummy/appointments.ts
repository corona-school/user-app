import { DateTime } from 'luxon';
import { isCourseNow } from '../../../helper/appointment-helper';
import { AppointmentType, CalendarDates } from '../../../types/lernfair/Appointment';
import { pupilsAppointments } from './testdata';

// TODO should add the logic in the BE
const courses = pupilsAppointments;

const getCourseEndDateISO = (startDate: string, duration: number) => {
    const firstStart = DateTime.fromISO(startDate);
    return firstStart.plus({ minutes: duration }).toISO();
};

const sortAppointments = (): AppointmentType[] => {
    return courses.sort((firstCourse, secondCourse) => {
        const firstEndDate = getCourseEndDateISO(firstCourse.startDate, firstCourse.duration);
        const secondEndDate = getCourseEndDateISO(secondCourse.startDate, secondCourse.duration);
        const first = DateTime.fromISO(firstEndDate).toMillis();
        const second = DateTime.fromISO(secondEndDate).toMillis();
        return first - second;
    });
};
const sortedAppointments = sortAppointments();

export const getAppointmentsForMonth = (appointments: AppointmentType[]) => {
    const dates: CalendarDates = {};

    for (let appointment of appointments) {
        const date = DateTime.fromISO(appointment.startDate);
        let year = date.year;
        let month = date.month;
        let week = date.weekNumber;
        if (!dates[year]) {
            dates[year] = {};
        }
        if (!dates[year][month]) {
            dates[year][month] = {};
        }
        if (!dates[year][month][week]) {
            dates[year][month][week] = [];
        }
        dates[year][month][week]!.push(appointment);
    }
    return dates;
};
const monthAppointments = getAppointmentsForMonth(sortedAppointments);

const findNextCourse = (appointments: AppointmentType[]) => {
    const now = DateTime.now();
    const next = appointments.find((appointment) => DateTime.fromISO(appointment.startDate) > now);
    return next?.id ?? 0;
};

const findCurrentCourse = (appointments: AppointmentType[]) => {
    const current = appointments.find((appointment) => isCourseNow(appointment.startDate, appointment.duration));
    return current?.id;
};

const nextCourseId = findNextCourse(courses);
const currentCourseId = findCurrentCourse(courses);

export default { monthAppointments, nextCourseId, currentCourseId };
