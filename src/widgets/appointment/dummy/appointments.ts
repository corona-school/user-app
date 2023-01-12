import { DateTime } from 'luxon';
import { AppointmentType, CalendarDates } from '../../../types/lernfair/Appointment';
import { pupilsAppointments } from './testdata';

const courses = pupilsAppointments;

const sortAppointments = (): AppointmentType[] => {
    return courses.sort((firstCourse, secondCourse) => {
        const first = DateTime.fromISO(firstCourse.startDate).toMillis();
        const second = DateTime.fromISO(secondCourse.startDate).toMillis();
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
    return appointments.find((appointment) => DateTime.fromISO(appointment.startDate) > now);
};

const nextCourse = findNextCourse(courses);

export default { monthAppointments, nextCourse };
