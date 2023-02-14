import { Divider, VStack } from 'native-base';
import { useNavigate } from 'react-router-dom';
import { AppointmentType } from '../../../types/lernfair/Appointment';
import AppointmentDay from '../AppointmentDay';

type WeekProps = {
    key: React.Key;
    appointmentsOfWeek: AppointmentType[];
    lastOfMonth: boolean;
    scrollToRef?: any;
    scrollId?: number;
    isStatic?: boolean;
};

const CalendarWeek: React.FC<WeekProps> = ({ appointmentsOfWeek, lastOfMonth, scrollToRef, scrollId, isStatic }) => {
    const navigate = useNavigate();
    return (
        <VStack>
            {appointmentsOfWeek &&
                appointmentsOfWeek.map((appointment: AppointmentType) => {
                    return (
                        <AppointmentDay
                            first={appointmentsOfWeek[0].id === appointment.id}
                            courseStart={appointment.start}
                            duration={appointment.duration}
                            courseTitle={appointment.title}
                            instructors={appointment.organizers}
                            participants={appointment.participants}
                            scrollToRef={appointment.id === scrollId ? scrollToRef : null}
                            isStatic={isStatic}
                            onPress={() => navigate(`/appointment/${appointment.id}`)}
                        />
                    );
                })}
            {!lastOfMonth && <Divider my={5} width="95%" />}
        </VStack>
    );
};

export default CalendarWeek;
