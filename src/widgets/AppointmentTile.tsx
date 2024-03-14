import { Box, Card, HStack, VStack, Text, Avatar, Heading, useBreakpointValue, Spacer } from 'native-base';
import WarningIcon from '../assets/icons/lernfair/icon_achtung.svg';
import StudentAvatar from '../assets/icons/lernfair/avatar_student.svg';
import PupilAvatar from '../assets/icons/lernfair/avatar_pupil.svg';
import { Pressable } from 'react-native';
import { AppointmentParticipant, Organizer } from '../gql/graphql';
import { useTranslation } from 'react-i18next';
import { Appointment } from '../types/lernfair/Appointment';
import VideoButton from '../components/VideoButton';

type Props = {
    timeDescriptionText: string;
    title: string;
    isCurrentlyTakingPlace: boolean;
    organizers?: Organizer[];
    participants?: AppointmentParticipant[];
    isReadOnly?: boolean;
    isFullWidth?: boolean;
    onPress?: () => void;
    appointmentType: Appointment['appointmentType'];
    position: Appointment['position'];
    total: Appointment['total'];
    isOrganizer: Appointment['isOrganizer'];
    displayName: Appointment['displayName'];
    appointmentId?: Appointment['id'];
    canJoinVideochat?: boolean;
};

const AppointmentTile: React.FC<Props> = ({
    timeDescriptionText,
    title,
    isCurrentlyTakingPlace,
    organizers,
    participants,
    isReadOnly,
    isFullWidth,
    onPress,
    position,
    displayName,
    appointmentId,
    appointmentType,
    isOrganizer,
}) => {
    const { t } = useTranslation();
    const width = useBreakpointValue({
        base: '100%',
        lg: isFullWidth ? '95%' : '90%',
    });

    const buttonWidth = useBreakpointValue({
        base: 'full',
        lg: '300',
    });
    return (
        <Box w={width}>
            <Pressable disabled={isReadOnly} onPress={onPress}>
                <Card bg={!isReadOnly && isCurrentlyTakingPlace ? 'primary.900' : 'primary.100'} shadow="none">
                    <VStack>
                        <HStack alignItems={'center'}>
                            <HStack>
                                {!isReadOnly && isCurrentlyTakingPlace && (
                                    <Box mr={2}>
                                        <WarningIcon />
                                    </Box>
                                )}
                                <Text fontSize={'xs'} color={!isReadOnly && isCurrentlyTakingPlace ? 'white' : 'primary.900'}>
                                    {timeDescriptionText}
                                </Text>
                            </HStack>
                            <Spacer />
                            {organizers && participants && (
                                <Avatar.Group _avatar={{ size: 'xs' }} space={-1} max={5}>
                                    {organizers
                                        ?.map((i) => (
                                            <Avatar key={`org_${i.id}`}>
                                                <StudentAvatar style={{ marginTop: '-1' }} />
                                            </Avatar>
                                        ))
                                        .concat(
                                            participants?.map((p) => (
                                                <Avatar key={`par_${p.id}`}>
                                                    <PupilAvatar style={{ marginTop: '-1' }} />
                                                </Avatar>
                                            ))
                                        )}
                                </Avatar.Group>
                            )}
                        </HStack>
                        <Box>
                            <Heading fontSize={'md'} color={!isReadOnly && isCurrentlyTakingPlace ? 'white' : 'primary.900'}>
                                {displayName}
                            </Heading>

                            {position && (
                                <Text mt={1} fontSize={'xs'} color={!isReadOnly && isCurrentlyTakingPlace ? 'white' : 'primary.900'}>
                                    {t('appointment.appointmentTile.lecture', { position: position }) +
                                        (title ? t('appointment.appointmentTile.title', { appointmentTitle: title }) : '')}
                                </Text>
                            )}
                        </Box>
                        {!isReadOnly && isCurrentlyTakingPlace && appointmentId && appointmentType && (
                            <Box mt={2}>
                                <VideoButton
                                    isInstructor={isOrganizer}
                                    canJoin
                                    appointmentId={appointmentId}
                                    appointmentType={appointmentType}
                                    width={buttonWidth}
                                />
                            </Box>
                        )}
                    </VStack>
                </Card>
            </Pressable>
        </Box>
    );
};

export default AppointmentTile;
