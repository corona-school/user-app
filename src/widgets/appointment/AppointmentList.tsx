import { DateTime } from 'luxon';
import { Box, Center, Divider, Text, useBreakpointValue } from 'native-base';
import { Appointment as Type } from '../../types/lernfair/Appointment';
import Appointment from './Appointment';
import { pupilsAppointments } from './testdata';

const AppointmentList: React.FC = () => {
    const courses = pupilsAppointments;

    const width = useBreakpointValue({
        base: '100%',
        lg: '90%',
    });

    const sortAppointments = (): Type[] => {
        return courses.sort((a, b) => {
            const _a = DateTime.fromISO(a.startDate).toMillis();
            const _b = DateTime.fromISO(b.startDate).toMillis();
            return _a - _b;
        });
    };

    const sortedAppointments = sortAppointments();

    const getAppointmentsForOneMonth = () => {
        const now = DateTime.now();

        // let month = DateTime.fromISO(sortedAppointments[0].startDate).month;
        // for (let i = 0; i <= sortedAppointments.length; i++) {
        //     const month1 = DateTime.fromISO(sortedAppointments[i].startDate).month;
        //     if (month1 > month) {
        //         month = month1;
        //     }
        // }
        // console.log(month);

        return sortedAppointments.filter((appoint) => {
            const appointmentDate = DateTime.fromISO(appoint.startDate);
            if (appointmentDate.year === now.year) {
                if (appointmentDate.month === now.month) {
                    return appoint;
                }
            }
        });
    };

    const monthAppointments = getAppointmentsForOneMonth();
    const month = DateTime.fromISO(monthAppointments[0].startDate).setLocale('de-DE').toLocaleString({ month: 'long', year: 'numeric' });

    const checkIfCourseMonthIsCurrentMonth = (course: {}) => {};

    return (
        <Box w={width}>
            <Center>
                <Text>{month}</Text>
            </Center>
            <Divider my={3} />
            {monthAppointments.map((appointment) => {
                return (
                    <Box>
                        <Appointment
                            courseStart={appointment.startDate}
                            duration={appointment.duration}
                            courseTitle={appointment.title}
                            instructors={appointment.organizers}
                            participants={appointment.participants}
                        />
                    </Box>
                );
            })}
        </Box>
    );
};

export default AppointmentList;
