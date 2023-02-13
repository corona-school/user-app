import { Button, HStack } from 'native-base';
import { useWeeklyAppointments } from '../context/AppointmentContext';
import { WeeklyReducerActionType } from '../context/CreateAppointment';
import { useLayoutHelper } from '../hooks/useLayoutHelper';
import AppointmentDate from './appointment/AppointmentDate';

type ButtonProps = {
    length: number;
};
const AddWeeklyAppointmentButton: React.FC<ButtonProps> = ({ length }) => {
    const { isMobile } = useLayoutHelper();
    const { dispatchWeeklyAppointment } = useWeeklyAppointments();

    const handleAddLecture = () => {
        dispatchWeeklyAppointment({ type: WeeklyReducerActionType.ADD_WEEKLY_APPOINTMENT });
    };

    return (
        <HStack space={2}>
            <AppointmentDate current={false} date={'2023-02-07T15:00:00Z'} color="primary.500" />
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
