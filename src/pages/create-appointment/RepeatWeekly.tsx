import { VStack } from 'native-base';
import AddNew from '../../widgets/AddNew';
import FurtherAppointment from './FurtherAppointment';
import WeeklyAppointment from './WeeklyAppointment';

type WeeklyProps = {
    length: number;
};

const RepeatWeekly: React.FC<WeeklyProps> = ({ length }) => {
    return (
        <VStack space="5">
            <WeeklyAppointment length={length} />
            <FurtherAppointment length={length} />
            <AddNew length={length + 1} />
        </VStack>
    );
};

export default RepeatWeekly;
