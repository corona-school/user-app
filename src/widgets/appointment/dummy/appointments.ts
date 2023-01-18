import { DateTime } from 'luxon';
import { isCourseTakingPlaceRightNow } from '../../../helper/appointment-helper';
import { AppointmentType, CalendarDates } from '../../../types/lernfair/Appointment';
import { pupilsAppointments } from './testdata';

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

const getAppointmentsForMonth = () => {
    const dates: CalendarDates = {};

    for (let appointment of sortedAppointments) {
        let year = DateTime.fromISO(appointment.startDate).year;
        let month = DateTime.fromISO(appointment.startDate).month;
        let week = DateTime.fromISO(appointment.startDate).weekNumber;
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
const monthAppointments = getAppointmentsForMonth();

const findNextCourse = (appointments: AppointmentType[]) => {
    const now = DateTime.now();
    const next = appointments.find((appointment) => DateTime.fromISO(appointment.startDate) > now);
    return next?.id ?? 0;
};

const findCurrentCourse = (appointments: AppointmentType[]) => {
    const current = appointments.find((appointment) => isCourseTakingPlaceRightNow(appointment.startDate, appointment.duration));
    return current?.id;
};

const nextCourseId = findNextCourse(courses);
const currentCourseId = findCurrentCourse(courses);

export default { monthAppointments, nextCourseId, currentCourseId };
