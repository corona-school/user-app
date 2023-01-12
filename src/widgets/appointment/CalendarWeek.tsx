import { Box, Divider } from 'native-base';
import { isCourseTakingPlaceRightNow } from '../../helper/appointment-helper';
import { AppointmentType } from '../../types/lernfair/Appointment';
import Appointment from './Appointment';
import appointments from './dummy/appointments';

type WeekProps = {
    appointmentsOfWeek: AppointmentType[];
    lastOfMonth: boolean;
    scrollToRef: any;
};

const CalendarWeek: React.FC<WeekProps> = ({ appointmentsOfWeek, lastOfMonth, scrollToRef }) => {
    const next = appointments.nextCourse;

    const isThereCurrentCourse = (appointments: AppointmentType[]) => {
        return appointments.some((appoint) => {
            return isCourseTakingPlaceRightNow(appoint.startDate, appoint.duration);
        });
    };

    return (
        <Box>
            {appointmentsOfWeek &&
                appointmentsOfWeek.map((appointment: AppointmentType) => {
                    const courseRef = () => {
                        if (isThereCurrentCourse(appointmentsOfWeek)) {
                            return isCourseTakingPlaceRightNow(appointment.startDate, appointment.duration);
                        } else if (appointment.id === next?.id) {
                            return true;
                        } else return false;
                    };

                    const showRef = courseRef();
                    return (
                        <Appointment
                            courseStart={appointment.startDate}
                            duration={appointment.duration}
                            courseTitle={appointment.title}
                            instructors={appointment.organizers}
                            participants={appointment.participants}
                            scrollToRef={showRef ? scrollToRef : null}
                        />
                    );
                })}
            {!lastOfMonth && <Divider my={5} />}
        </Box>
    );
};

export default CalendarWeek;
