import { Box, Card, HStack, VStack, Text, Avatar, Button, Heading, useBreakpointValue, Spacer } from 'native-base';
import WarningIcon from '../../assets/icons/lernfair/icon_achtung.svg';
import StudentAvatar from '../../assets/icons/lernfair/avatar_student.svg';
import PupilAvatar from '../../assets/icons/lernfair/avatar_pupil.svg';
import { Pressable } from 'react-native';
import { Student } from '../../gql/graphql';
import { Participant } from '../../types/lernfair/User';

type Props = {
    timeDescriptionText: string;
    courseTitle: string;
    isCurrentlyTakingPlace: boolean;
    organizers?: Student[];
    participants?: Participant[];
    isReadOnly?: boolean;
    onPress?: () => void;
};

const AppointmentTile: React.FC<Props> = ({ timeDescriptionText, courseTitle, isCurrentlyTakingPlace, organizers, participants, isReadOnly, onPress }) => {
    const width = useBreakpointValue({
        base: '100%',
        lg: '90%',
    });

    return (
        <Box w={width}>
            <Card bg={isCurrentlyTakingPlace ? 'primary.900' : 'primary.100'} shadow="none">
                <Pressable disabled={isReadOnly} onPress={onPress}>
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
                            {!isReadOnly && organizers && participants && (
                                <Avatar.Group _avatar={{ size: 'xs' }} space={-1} max={5}>
                                    {organizers
                                        ?.map((i, idx) => (
                                            <Avatar key={i.lastname + '-' + idx}>
                                                <StudentAvatar style={{ marginTop: '-1' }} />
                                            </Avatar>
                                        ))
                                        .concat(
                                            participants?.map((p, index) => (
                                                <Avatar key={p.firstname + '-' + index}>
                                                    <PupilAvatar style={{ marginTop: '-1' }} />
                                                </Avatar>
                                            ))
                                        )}
                                </Avatar.Group>
                            )}
                        </HStack>
                        <Box>
                            <Heading fontSize={'md'} color={isCurrentlyTakingPlace ? 'white' : 'primary.900'}>
                                {courseTitle}
                            </Heading>

                            <Text mt={1} fontSize={'xs'} color={isCurrentlyTakingPlace ? 'white' : 'primary.900'}>
                                {organizers
                                    ?.map((organizers) => {
                                        return `${organizers.firstname} ${organizers.lastname}`;
                                    })
                                    .join(', ')}
                            </Text>
                        </Box>
                        {isCurrentlyTakingPlace && <Button mt={2}>Videochat beitreten</Button>}
                    </VStack>
                </Pressable>
            </Card>
        </Box>
    );
};

export default AppointmentTile;
