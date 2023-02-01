import { Button, VStack, Box } from 'native-base';
import AppointmentDate from './appointment/AppointmentDate';

type ButtonProps = {
    length: number;
};
const AddNew: React.FC<ButtonProps> = ({ length }) => {
    return (
        <VStack mt="5" space={3} direction="row" width="full">
            <Box width="10vw">
                <AppointmentDate current={false} date={'2023-02-07T15:00:00Z'} color="primary.500" />
            </Box>
            <Button variant="outline" borderStyle="dashed" borderWidth="2" borderColor="primary.500" _text={{ color: 'primary.500' }} width="75vw">
                {`Lektion #${length + 1} hinzufügen`}
            </Button>
        </VStack>
    );
};

export default AddNew;
