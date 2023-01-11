import { Box, Divider } from 'native-base';
import { isCourseTakingPlaceRightNow } from '../../helper/appointment-helper';
import { AppointmentType } from '../../types/lernfair/Appointment';
import Appointment from './Appointment';

type WeekProps = {
    appointmentsOfWeek: AppointmentType[];
    lastOfMonth: boolean;
    scrollToRef: any;
};
const CalendarWeek: React.FC<WeekProps> = ({ appointmentsOfWeek, lastOfMonth, scrollToRef }) => {
    return (
        <Box>
            {appointmentsOfWeek &&
                appointmentsOfWeek.map((appointment: AppointmentType) => {
                    const current = isCourseTakingPlaceRightNow(appointment.startDate, appointment.duration);

                    return (
                        <Appointment
                            courseStart={appointment.startDate}
                            duration={appointment.duration}
                            courseTitle={appointment.title}
                            instructors={appointment.organizers}
                            participants={appointment.participants}
                            scrollToRef={current ? scrollToRef : null}
                        />
                    );
                })}
            {!lastOfMonth && <Divider my={5} />}
        </Box>
    );
};

export default CalendarWeek;
