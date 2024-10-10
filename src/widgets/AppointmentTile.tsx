import { Box, Card, HStack, VStack, Text, Avatar, Heading, useBreakpointValue, Spacer } from 'native-base';
import StudentAvatar from '../assets/icons/lernfair/avatar_student.svg';
import PupilAvatar from '../assets/icons/lernfair/avatar_pupil.svg';
import { Pressable } from 'react-native';
import { AppointmentParticipant, Organizer } from '../gql/graphql';
import { useTranslation } from 'react-i18next';
import { Appointment } from '../types/lernfair/Appointment';
import VideoButton from '../components/VideoButton';
import { IconInfoCircle, IconPointFilled } from '@tabler/icons-react';
import { Typography } from '@/components/Typography';
import { cn } from '@/lib/Tailwind';
import { useUser } from '@/hooks/useApollo';

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
    wasRejected: boolean;
    declinedBy: Appointment['declinedBy'];
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
    wasRejected,
    declinedBy,
}) => {
    const { t } = useTranslation();
    const width = useBreakpointValue({
        base: '100%',
        lg: isFullWidth ? '92%' : '90%',
    });
    const { userID } = useUser();

    const buttonWidth = useBreakpointValue({
        base: 'full',
        lg: '300',
    });

    const byMatch = !declinedBy?.includes(userID);
    const isHighlighted = !isReadOnly && isCurrentlyTakingPlace && !wasRejected;
    const wasRejectedByMatch = appointmentType === 'match' && wasRejected && byMatch;

    return (
        <Box w={width}>
            <Pressable disabled={isReadOnly} onPress={onPress}>
                <Card bg={isHighlighted ? 'primary.900' : 'primary.100'} shadow="none">
                    <VStack>
                        <HStack alignItems={'center'}>
                            <HStack>
                                {isHighlighted && (
                                    <Box mr={2}>
                                        <div className="relative">
                                            <span className="absolute animate-[ping_1.5s_infinite] size-4 rounded-full bg-green-300 opacity-75"></span>
                                            <IconPointFilled className="size-4 text-green-400" />
                                        </div>
                                    </Box>
                                )}
                                <Typography variant="sm" className={cn(wasRejected ? 'line-through' : '', isHighlighted ? 'text-white' : 'text-primary')}>
                                    {timeDescriptionText}
                                </Typography>
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
                            <Heading fontSize={'md'} color={isHighlighted ? 'white' : 'primary.900'}>
                                {displayName}
                            </Heading>

                            {position && (
                                <Text mt={1} fontSize={'xs'} color={isHighlighted ? 'white' : 'primary.900'}>
                                    {t('appointment.appointmentTile.lecture', { position: position }) +
                                        (title ? t('appointment.appointmentTile.title', { appointmentTitle: title }) : '')}
                                </Text>
                            )}
                            {wasRejectedByMatch && (
                                <div className="flex gap-x-1 items-center pt-1">
                                    <IconInfoCircle className="text-red-600" size={17} />
                                    <Typography variant="sm" className="text-red-600">
                                        {t('appointment.appointmentTile.cancelledBy', { name: displayName })}
                                    </Typography>
                                </div>
                            )}
                        </Box>
                        {isHighlighted && appointmentId && appointmentType && (
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
