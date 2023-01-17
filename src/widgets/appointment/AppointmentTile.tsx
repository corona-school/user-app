import { Box, Card, HStack, VStack, Text, Avatar, Button, Heading, useBreakpointValue, Spacer } from 'native-base';
import WarningIcon from '../../assets/icons/lernfair/icon_achtung.svg';
import StudentAvatar from '../../assets/icons/lernfair/avatar_student.svg';
import PupilAvatar from '../../assets/icons/lernfair/avatar_pupil.svg';

type Props = {
    timeDescriptionText: string;
    courseTitle: string;
    isCurrentlyTakingPlace: boolean;
    instructors?: string[];
    participants?: string[];
};

const AppointmentTile: React.FC<Props> = ({ timeDescriptionText, courseTitle, isCurrentlyTakingPlace, instructors, participants }) => {
    const width = useBreakpointValue({
        base: '100%',
        lg: '90%',
    });

    return (
        <Box w={width}>
            <Card bg={isCurrentlyTakingPlace ? 'primary.900' : 'primary.100'} shadow="none">
                <VStack>
                    <HStack alignItems={'center'}>
                        <HStack>
                            {isCurrentlyTakingPlace && (
                                <Box mr={2}>
                                    <WarningIcon />
                                </Box>
                            )}
                            <Text fontSize={'xs'} color={isCurrentlyTakingPlace ? 'white' : 'primary.900'}>
                                {timeDescriptionText}
                            </Text>
                        </HStack>
                        <Spacer />
                        <Avatar.Group _avatar={{ size: 'xs' }} space={-1} max={5}>
                            {instructors
                                ?.map((i) => (
                                    <Avatar key={i}>
                                        <StudentAvatar style={{ marginTop: '-1' }} />
                                    </Avatar>
                                ))
                                .concat(
                                    participants?.map((i) => (
                                        <Avatar key={i}>
                                            <PupilAvatar style={{ marginTop: '-1' }} />
                                        </Avatar>
                                    )) ?? []
                                )}
                        </Avatar.Group>
                    </HStack>
                    <Box>
                        <Heading fontSize={'md'} color={isCurrentlyTakingPlace ? 'white' : 'primary.900'}>
                            {courseTitle}
                        </Heading>

                        <Text mt={1} fontSize={'xs'} color={isCurrentlyTakingPlace ? 'white' : 'primary.900'}>
                            {instructors?.join(', ')}
                        </Text>
                    </Box>
                    {isCurrentlyTakingPlace && <Button mt={2}>Videochat beitreten</Button>}
                </VStack>
            </Card>
        </Box>
    );
};

export default AppointmentTile;
