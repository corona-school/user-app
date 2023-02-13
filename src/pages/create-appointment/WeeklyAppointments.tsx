import { VStack } from 'native-base';
import { useWeeklyAppointments } from '../../context/AppointmentContext';
import AddWeeklyAppointmentButton from '../../widgets/AddWeeklyAppointmentButton';
import WeeklyAppointmentForm from './WeeklyAppointmentForm';

type WeeklyProps = {
    length: number;
};

const WeeklyAppointments: React.FC<WeeklyProps> = ({ length }) => {
    const { weeklies } = useWeeklyAppointments();

    return (
        <VStack space="5">
            {weeklies.map((w, idx) => (
                <WeeklyAppointmentForm isLast={idx === weeklies.length - 1} index={idx} key={idx} />
            ))}
            <AddWeeklyAppointmentButton length={length + 1} />
        </VStack>
    );
};

export default WeeklyAppointments;
