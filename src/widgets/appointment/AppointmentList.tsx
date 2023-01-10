import { DateTime } from 'luxon';
import { Box, useBreakpointValue } from 'native-base';
import { Appointment as AppointmentType, CalendarDates } from '../../types/lernfair/Appointment';
import CalendarYear from './CalendarYear';
import { pupilsAppointments } from './testdata';

const AppointmentList: React.FC = () => {
    const courses = pupilsAppointments;

    const width = useBreakpointValue({
        base: '100%',
        lg: '90%',
    });

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

    return (
        <Box width={width}>
            {Object.entries(monthAppointments).map((year) => {
                return <CalendarYear year={year[0]} appointments={year[1]} />;
            })}
        </Box>
    );
};

export default AppointmentList;
