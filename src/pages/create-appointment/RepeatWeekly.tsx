import { VStack } from 'native-base';
import { useCreateAppointments } from '../../hooks/useCreateAppointment';
import AddNew from '../../widgets/AddNew';
import FurtherAppointment from './FurtherAppointment';
import WeeklyAppointment from './WeeklyAppointment';

type WeeklyProps = {
    length: number;
};

const RepeatWeekly: React.FC<WeeklyProps> = ({ length }) => {
    const { weeklyAppointment } = useCreateAppointments();

    return (
        <VStack space="5">
            {weeklyAppointment && weeklyAppointment.map((appointment) => <WeeklyAppointment length={length} />)}
            {/* {weeklyAppointment[weeklyAppointment.length -1 ]} */}
            <FurtherAppointment length={length} />
            <AddNew length={length + 1} />
        </VStack>
    );
};

export default RepeatWeekly;
