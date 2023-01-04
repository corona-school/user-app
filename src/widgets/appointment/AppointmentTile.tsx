import { Box, Card, HStack, VStack, Text, Avatar, Spacer, Button, Heading, useBreakpointValue } from 'native-base';
import WarningIcon from '../../assets/icons/lernfair/icon_achtung.svg';

type Props = {
    timeText: string;
    courseTitle: string;
    courseInstructor: string;
    current: boolean;
};

const AppointmentTile: React.FC<Props> = ({ timeText, courseTitle, courseInstructor, current }) => {
    const width = useBreakpointValue({
        base: '100%',
        lg: '90%',
    });

    return (
        <Box w={width}>
            <Card bg={current ? 'primary.900' : 'primary.100'} shadow={'none'}>
                <VStack>
                    <HStack alignItems={'center'}>
                        <HStack>
                            {current && (
                                <Box mr={2}>
                                    <WarningIcon />
                                </Box>
                            )}
                            <Text fontSize={'xs'} color={current ? 'white' : 'primary.900'}>
                                {timeText}
                            </Text>
                        </HStack>
                        <Spacer />
                        <Avatar.Group _avatar={{ size: 'xs' }} max={5}>
                            <Avatar
                                source={{
                                    uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
                                }}
                            ></Avatar>
                            <Avatar
                                source={{
                                    uri: 'https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
                                }}
                            ></Avatar>
                        </Avatar.Group>
                    </HStack>
                    <Box>
                        <Heading fontSize={'md'} color={current ? 'white' : 'primary.900'}>
                            {courseTitle}
                        </Heading>
                        <Text mt={1} fontSize={'xs'} color={current ? 'white' : 'primary.900'}>
                            {courseInstructor}
                        </Text>
                    </Box>
                    {/* BUG: have to be: {t("appointment.tile.videoButton")}  */}
                    {current && <Button mt={2}>Videochat beitreten</Button>}
                </VStack>
            </Card>
        </Box>
    );
};

export default AppointmentTile;
