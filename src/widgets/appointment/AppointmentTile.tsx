import { Box, Card, HStack, VStack, Text, Avatar, Button, Heading, useBreakpointValue, Spacer } from 'native-base';
import WarningIcon from '../../assets/icons/lernfair/icon_achtung.svg';
import StudentAvatar from '../../assets/icons/lernfair/avatar_student.svg';
import PupilAvatar from '../../assets/icons/lernfair/avatar_pupil.svg';
import { Pressable } from 'react-native';
import { AppointmentParticipant, Organizer } from '../../gql/graphql';
import { useTranslation } from 'react-i18next';
import { Appointment } from '../../types/lernfair/Appointment';
import { useNavigate } from 'react-router-dom';

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
    chatType?: Appointment['appointmentType'];
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
    chatType,
}) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const width = useBreakpointValue({
        base: '100%',
        lg: isFullWidth ? '95%' : '90%',
    });

    return (
        <Box w={width}>
            <Card bg={isCurrentlyTakingPlace ? 'primary.900' : 'primary.100'} shadow="none">
                <Pressable onPress={onPress}>
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
                                {displayName}
                            </Heading>

                            {position && (
                                <Text mt={1} fontSize={'xs'} color={isCurrentlyTakingPlace ? 'white' : 'primary.900'}>
                                    {t('appointment.appointmentTile.lecture', { position: position }) +
                                        (title ? t('appointment.appointmentTile.title', { appointmentTitle: title }) : '')}
                                </Text>
                            )}
                        </Box>
                        {isCurrentlyTakingPlace && (
                            <Button
                                mt={2}
                                onPress={() => {
                                    appointmentId && navigate(`/video-chat/${appointmentId}/${chatType}`);
                                }}
                            >
                                {t('appointment.tile.videoButton')}
                            </Button>
                        )}
                    </VStack>
                </Pressable>
            </Card>
        </Box>
    );
};

export default AppointmentTile;
