import { AddIcon, Box, Fab, useBreakpointValue } from 'native-base';

type FabProps = {
    place?: any;
    handlePress?: () => void;
    icon?: JSX.Element;
    mr?: number;
    mb?: number;
    mt?: number;
};
const FloatinActionButton: React.FC<FabProps> = ({ handlePress, place, icon, mr, mb, mt }) => {
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
                mt={mt ? mt : marginTop}
                mb={mb ? mb : marginBottom}
                mr={mr ? mr : marginRight}
                position="fixed"
                placement={place}
                backgroundColor="primary.900"
                rounded="md"
                size="md"
                icon={icon ? icon : <AddIcon />}
                onPress={handlePress}
            />
        </Box>
    );
};

export default FloatinActionButton;
