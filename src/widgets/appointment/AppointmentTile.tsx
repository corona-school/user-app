import { Box, Card, HStack, VStack, Text, Avatar, Spacer, Button, Heading } from 'native-base';
import AppointmentDate from './AppointmentDate';
import { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import { getCourseTime } from '../../helper/appointment-helper';

type Props = {
    courseStart: string;
    duration: number;
    courseTitle: string;
    courseInstructor: string;
};

const AppointmentTile: React.FC<Props> = ({ courseStart, duration, courseTitle, courseInstructor }) => {
    const [isCurrent, setIsCurrent] = useState<boolean>(false);

    useEffect(() => {
        const now = DateTime.now();
        const start = DateTime.fromISO(courseStart);
        if (start >= now) {
            setIsCurrent(false);
        } else {
            setIsCurrent(true);
        }
    }, [courseStart]);

    return (
        <Box w={300}>
            <HStack>
                <AppointmentDate current={isCurrent} date={courseStart} />
                <Spacer />
                <Box w={248}>
                    <Card bg={isCurrent ? 'primary.900' : 'primary.100'} shadow={'none'}>
                        <VStack>
                            <HStack alignItems={'center'}>
                                <Text fontSize={'xs'} color={isCurrent ? 'white' : 'primary.900'}>
                                    {getCourseTime(courseStart, duration)}
                                </Text>
                                <Spacer />
                                <Avatar.Group>
                                    <Avatar size={'xs'}></Avatar>
                                    <Avatar size={'xs'}></Avatar>
                                    <Avatar size={'xs'}></Avatar>
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
