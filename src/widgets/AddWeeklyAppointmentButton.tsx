import { Button, HStack } from 'native-base';
import { useWeeklyAppointments } from '../context/AppointmentContext';
import { WeeklyReducerActionType } from '../types/lernfair/CreateAppointment';
import { useLayoutHelper } from '../hooks/useLayoutHelper';
import AppointmentDate from './appointment/AppointmentDate';

type ButtonProps = {
    length: number;
    nextDate: string;
};
const AddWeeklyAppointmentButton: React.FC<ButtonProps> = ({ length, nextDate }) => {
    const { isMobile } = useLayoutHelper();
    const { dispatchWeeklyAppointment } = useWeeklyAppointments();

    const handleAddLecture = () => {
        dispatchWeeklyAppointment({
            index: length + 1,
            type: WeeklyReducerActionType.ADD_WEEKLY_APPOINTMENT,
            nextDate: nextDate,
        });
    };

    return (
        <HStack space={2}>
            <AppointmentDate current={false} date={nextDate} color="primary.500" />
            <Button
                variant="outline"
                borderStyle="dashed"
                borderWidth="2"
                borderColor="primary.500"
                _text={{ color: 'primary.500' }}
                width={isMobile ? '86%' : '46%'}
                onPress={() => handleAddLecture()}
            >
                {`Lektion #${length + 1} hinzufügen`}
            </Button>
        </HStack>
    );
};

export default AddWeeklyAppointmentButton;
