import { Button, HStack, Box } from 'native-base';
import { useLayoutHelper } from '../hooks/useLayoutHelper';
import AppointmentDate from './appointment/AppointmentDate';

type ButtonProps = {
    length: number;
};
const AddNew: React.FC<ButtonProps> = ({ length }) => {
    const { isMobile } = useLayoutHelper();

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
                onPress={() => console.log('neuer wöchentlicher Termin')}
            >
                {`Lektion #${length + 1} hinzufügen`}
            </Button>
        </HStack>
    );
};

export default AddNew;
