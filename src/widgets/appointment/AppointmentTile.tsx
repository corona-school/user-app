import { Box, Card, HStack, VStack, Text, Avatar, Spacer } from 'native-base';
import AppointmentDate from './AppointmentDate';

const AppointmentTile = () => {
    const current = true;
    return (
        <Box w={288}>
            <HStack>
                <AppointmentDate current={current} />
                <Spacer />

                <Box w={248}>
                    <Card bg={current ? 'primary.900' : 'primary.100'} shadow={'none'}>
                        <VStack>
                            <HStack alignItems={'center'}>
                                <Text fontSize={'xs'} color={current ? 'white' : ''}>
                                    11:00 – 12:00 Uhr
                                </Text>
                                <Spacer />
                                <Avatar.Group>
                                    <Avatar size={'xs'}></Avatar>
                                    <Avatar size={'xs'}></Avatar>
                                    <Avatar size={'xs'}></Avatar>
                                </Avatar.Group>
                            </HStack>
                            <Box>
                                <Text fontSize={'md'} color={current ? 'white' : ''}>
                                    Grundlagen Tutorium
                                </Text>
                                <Text fontSize={'xs'} color={current ? 'white' : ''}>
                                    Andreas Müller
                                </Text>
                            </Box>
                        </VStack>
                    </Card>
                </Box>
            </HStack>
        </Box>
    );
};

export default AppointmentTile;
