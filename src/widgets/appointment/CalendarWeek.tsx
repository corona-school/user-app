import { Box, Divider } from 'native-base';
import { AppointmentType } from '../../types/lernfair/Appointment';
import Appointment from './Appointment';

type WeekProps = {
    key: React.Key;
    appointmentsOfWeek: AppointmentType[];
    lastOfMonth: boolean;
    scrollToRef: any;
    scrollId: number;
};

const CalendarWeek: React.FC<WeekProps> = ({ appointmentsOfWeek, lastOfMonth, scrollToRef, scrollId }) => {
    return (
        <Box>
            {appointmentsOfWeek &&
                appointmentsOfWeek.map((appointment: AppointmentType) => {
                    return (
                        <Appointment
                            key={appointment.id}
                            courseStart={appointment.startDate}
                            duration={appointment.duration}
                            courseTitle={appointment.title}
                            instructors={appointment.organizers}
                            participants={appointment.participants}
                            scrollToRef={appointment.id === scrollId ? scrollToRef : null}
                        />
                    );
                })}
            {!lastOfMonth && <Divider my={5} width="95%" />}
        </Box>
    );
};

export default CalendarWeek;
