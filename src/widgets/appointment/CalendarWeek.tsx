import { Box, Divider } from 'native-base';
import { AppointmentType } from '../../types/lernfair/Appointment';
import Appointment from './Appointment';

type WeekProps = {
    appointments: any;
};
const CalendarWeek: React.FC<WeekProps> = ({ appointments }) => {
    return (
        <Box>
            {appointments &&
                appointments.map((appointment: AppointmentType) => {
                    return (
                        <Appointment
                            courseStart={appointment.startDate}
                            duration={appointment.duration}
                            courseTitle={appointment.title}
                            instructors={appointment.organizers}
                            participants={appointment.participants}
                        />
                    );
                })}
            <Divider my={5} />
        </Box>
    );
};

export default CalendarWeek;
