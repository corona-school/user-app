import { t } from 'i18next';
import { Box, Card, HStack, VStack, Text, Avatar, Button, Heading, useBreakpointValue, Spacer } from 'native-base';
import WarningIcon from '../../assets/icons/lernfair/icon_achtung.svg';
import StudentAvatar from '../../assets/icons/lernfair/avatar_student.svg';
import PupilAvatar from '../../assets/icons/lernfair/avatar_pupil.svg';

type Props = {
    timeDescriptionText: string;
    courseTitle: string;
    courseInstructor: string;
    isCurrentlyTakingPlace: boolean;
};

const AppointmentTile: React.FC<Props> = ({ timeDescriptionText, courseTitle, courseInstructor, isCurrentlyTakingPlace }) => {
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
                        <Avatar.Group _avatar={{ size: 'xs' }} max={3}>
                            <Avatar>
                                <StudentAvatar />
                            </Avatar>
                            <Avatar>
                                <PupilAvatar />
                            </Avatar>
                            <Avatar>
                                <PupilAvatar />
                            </Avatar>
                            <Avatar>
                                <PupilAvatar />
                            </Avatar>
                            <Avatar>
                                <PupilAvatar />
                            </Avatar>
                        </Avatar.Group>
                    </HStack>
                    <Box>
                        <Heading fontSize={'md'} color={isCurrentlyTakingPlace ? 'white' : 'primary.900'}>
                            {courseTitle}
                        </Heading>
                        <Text mt={1} fontSize={'xs'} color={isCurrentlyTakingPlace ? 'white' : 'primary.900'}>
                            {courseInstructor}
                        </Text>
                    </Box>
                    {isCurrentlyTakingPlace && <Button mt={2}>{t('appointment.tile.videoButton') as string}</Button>}
                </VStack>
            </Card>
        </Box>
    );
};

export default AppointmentTile;
