import { AddIcon, Box, Fab, useBreakpointValue } from 'native-base';

type FabProps = {
    place?: any;
    handlePress?: () => void;
};
const AddAppointmentButton: React.FC<FabProps> = ({ handlePress, place }) => {
    const marginRight = useBreakpointValue({
        base: 5,
        lg: 50,
    });

    const marginTop = useBreakpointValue({
        base: 0,
        lg: '5%',
    });

    const marginBottom = useBreakpointValue({
        base: '20%',
        lg: 0,
    });

    return (
        <Box>
            <Fab
                mt={marginTop}
                mb={marginBottom}
                mr={marginRight}
                position="fixed"
                placement={place}
                backgroundColor="primary.900"
                rounded="md"
                size="md"
                icon={<AddIcon />}
                onPress={handlePress}
            />
        </Box>
    );
};

export default AddAppointmentButton;
