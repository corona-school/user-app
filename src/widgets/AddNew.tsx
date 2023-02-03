import { Button, HStack } from 'native-base';
import { useCreateAppointments } from '../hooks/useCreateAppointment';
import { useLayoutHelper } from '../hooks/useLayoutHelper';
import AppointmentDate from './appointment/AppointmentDate';

type ButtonProps = {
    length: number;
};
const AddNew: React.FC<ButtonProps> = ({ length }) => {
    const { isMobile } = useLayoutHelper();
    const { setWeeklyAppointment } = useCreateAppointments();

    return (
        <HStack space={3}>
            <AppointmentDate current={false} date={'2023-02-07T15:00:00Z'} color="primary.500" />
            <Button
                variant="outline"
                borderStyle="dashed"
                borderWidth="2"
                borderColor="primary.500"
                _text={{ color: 'primary.500' }}
                width={isMobile ? '86%' : '45%'}
                onPress={() => setWeeklyAppointment((prev: any) => [...prev, { time: '', duration: '', date: '' }])}
            >
                {`Lektion #${length + 1} hinzufügen`}
            </Button>
        </HStack>
    );
};

export default AddNew;
