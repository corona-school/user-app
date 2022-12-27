import { Circle, Text, useBreakpointValue } from 'native-base';

const InformationBadge = () => {
    const ml = useBreakpointValue({
        base: 1,
        lg: 2,
    });

    return (
        <Circle rounded="full" bg="amber.700" size={4} ml={ml}>
            <Text color={'white'}>i</Text>
        </Circle>
    );
};

export default InformationBadge;
