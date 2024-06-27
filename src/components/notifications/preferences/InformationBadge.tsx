import { Circle, Text, useBreakpointValue, ICircleProps } from 'native-base';

interface InformationBadgeProps extends ICircleProps {}

const InformationBadge = ({ bg = 'danger.100', size = 4, ml, ...rest }: InformationBadgeProps) => {
    const defaultMl = useBreakpointValue({
        base: 1,
        lg: 2,
    });

    return (
        <Circle rounded="full" bg={bg} size={4} ml={ml ?? defaultMl} {...rest}>
            <Text color={'white'}>i</Text>
        </Circle>
    );
};

export default InformationBadge;
