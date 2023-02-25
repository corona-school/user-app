import { Circle, Text, useBreakpointValue } from 'native-base';

const InformationBadge = () => {
    const ml = useBreakpointValue({
        base: 1,
        lg: 2,
    });

    return (
        <Circle rounded="full" bg="danger.100" size={4} ml={ml}>
            <Text color={'white'}>i</Text>
        </Circle>
    );
};

export default InformationBadge;
