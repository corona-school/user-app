import { Divider, VStack } from 'native-base';
import { useNavigate } from 'react-router-dom';
import { AppointmentType } from '../../types/lernfair/Appointment';
import AppointmentDay from './AppointmentDay';

type WeekProps = {
    key: React.Key;
    appointmentsOfWeek: AppointmentType[];
    lastOfMonth: boolean;
    scrollToRef: any;
    scrollId: number;
};

const CalendarWeek: React.FC<WeekProps> = ({ appointmentsOfWeek, lastOfMonth, scrollToRef, scrollId }) => {
    const navigate = useNavigate();
    return (
        <VStack>
            {appointmentsOfWeek &&
                appointmentsOfWeek.map((appointment: AppointmentType) => {
                    return (
                        <AppointmentDay
                            first={appointmentsOfWeek[0].id === appointment.id}
                            courseStart={appointment.startDate}
                            duration={appointment.duration}
                            courseTitle={appointment.title}
                            instructors={appointment.organizers}
                            participants={appointment.participants}
                            scrollToRef={appointment.id === scrollId ? scrollToRef : null}
                            onPress={() => navigate(`/appointment/${appointment.id}`)}
                        />
                    );
                })}
            {!lastOfMonth && <Divider my={5} width="95%" />}
        </VStack>
    );
};

export default CalendarWeek;
