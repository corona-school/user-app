import { VStack } from 'native-base';
import { useWeeklyAppointments } from '../../context/AppointmentContext';
import AddNew from '../../widgets/AddNew';
import WeeklyAppointment from './WeeklyAppointment';

type WeeklyProps = {
    length: number;
};

const RepeatWeekly: React.FC<WeeklyProps> = ({ length }) => {
    const { weeklies, dispatchWeeklyAppointment } = useWeeklyAppointments();

    return (
        <VStack space="5">
            {weeklies.map((w, idx) => (
                <WeeklyAppointment isLast={idx === weeklies.length - 1} index={idx} key={idx} />
            ))}
            <AddNew length={length + 1} />
        </VStack>
    );
};

export default RepeatWeekly;
