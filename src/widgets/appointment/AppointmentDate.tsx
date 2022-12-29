import { VStack, Text, Box } from 'native-base';

type Props = {
    current: boolean;
};
const AppointmentDate: React.FC<Props> = ({ current }) => {
    return (
        <VStack h={40}>
            <Box bg={current ? 'primary.100' : 'none'} p={2} borderRadius={5}>
                <Text fontSize={'xs'}>Do.</Text>
                <Text fontSize={'md'} bold>
                    29
                </Text>
            </Box>
        </VStack>
    );
};

export default AppointmentDate;
