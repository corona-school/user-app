import { Box, Fab, useBreakpointValue } from 'native-base';
import CalendarAddIcon from '../assets/icons/calendar_add.svg';

type FabProps = {
    place?: any;
    handlePress?: () => void;
    icon?: JSX.Element;
    mr?: number;
    mb?: number;
    mt?: number;
};
const FloatingActionButton: React.FC<FabProps> = ({ handlePress, place, icon, mr, mb, mt }) => {
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
        lg: '5%',
    });

    return (
        <Box>
            <Fab
                mt={mt ? mt : marginTop}
                mb={mb ? mb : marginBottom}
                mr={mr ? mr : marginRight}
                position="fixed"
                placement={place}
                backgroundColor="primary.900"
                rounded="md"
                size="md"
                icon={icon ? icon : <CalendarAddIcon />}
                onPress={handlePress}
            />
        </Box>
    );
};

export default FloatingActionButton;
