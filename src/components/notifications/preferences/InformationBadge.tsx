import { Circle, Text } from '@chakra-ui/react';

const InformationBadge = () => {
    return (
        <Circle rounded="full" bg="primary.500" size={4}>
            <Text color={'white'} margin={0}>
                i
            </Text>
        </Circle>
    );
};

export default InformationBadge;
