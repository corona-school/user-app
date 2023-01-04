import { Box, Card, HStack, VStack, Text, Avatar, Spacer, Button, Heading } from 'native-base';
import AppointmentDate from './AppointmentDate';
import { useEffect, useState } from 'react';
import { getCourseDate } from '../../helper/appointment-helper';
import WarningIcon from '../../assets/icons/lernfair/icon_achtung.svg';

type Props = {
    courseStart: string;
    duration: number;
    courseTitle: string;
    courseInstructor: string;
};

const AppointmentTile: React.FC<Props> = ({ courseStart, duration, courseTitle, courseInstructor }) => {
    const [isCurrent, setIsCurrent] = useState<boolean>(false);

    useEffect(() => {
        const currentOrNot = getCourseDate(courseStart, duration);
        setIsCurrent(currentOrNot.currentOrNot);
    }, [courseStart, duration]);

    return (
        <Box w={300}>
            <HStack>
                <AppointmentDate current={isCurrent} date={courseStart} />
                <Spacer />
                <Box w={248}>
                    <Card bg={isCurrent ? 'primary.900' : 'primary.100'} shadow={'none'}>
                        <VStack>
                            <HStack alignItems={'center'}>
                                <HStack>
                                    {isCurrent && (
                                        <Box mr={2}>
                                            <WarningIcon />
                                        </Box>
                                    )}
                                    <Text fontSize={'xs'} color={isCurrent ? 'white' : 'primary.900'}>
                                        {getCourseDate(courseStart, duration).timeText}{' '}
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
                                <Heading fontSize={'md'} color={isCurrent ? 'white' : 'primary.900'}>
                                    {courseTitle}
                                </Heading>
                                <Text mt={1} fontSize={'xs'} color={isCurrent ? 'white' : 'primary.900'}>
                                    {courseInstructor}
                                </Text>
                            </Box>
                            {isCurrent && <Button mt={2}>Videochat beitreten</Button>}
                        </VStack>
                    </Card>
                </Box>
            </HStack>
        </Box>
    );
};

export default AppointmentTile;
