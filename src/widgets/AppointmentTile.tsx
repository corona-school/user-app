import StudentAvatar from '../assets/icons/lernfair/avatar_student.svg';
import PupilAvatar from '../assets/icons/lernfair/avatar_pupil.svg';
import { AppointmentParticipant, Organizer } from '../gql/graphql';
import { useTranslation } from 'react-i18next';
import { Appointment } from '../types/lernfair/Appointment';
import VideoButton from '../components/VideoButton';
import { IconInfoCircle, IconPointFilled } from '@tabler/icons-react';
import { Typography } from '@/components/Typography';
import { cn } from '@/lib/Tailwind';
import { useUser } from '@/hooks/useApollo';
import { useMemo } from 'react';

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
    const { userID } = useUser();

    const byMatch = !declinedBy?.includes(userID);
    const isHighlighted = !isReadOnly && isCurrentlyTakingPlace && !wasRejected;
    const wasRejectedByMatch = appointmentType === 'match' && wasRejected && byMatch;

    const avatars = useMemo(() => {
        return [...(organizers?.map((e) => 'student') || []), ...(participants?.map((e) => 'pupil') || [])].slice(0, 5);
    }, [organizers?.length, participants?.length]);

    return (
        <div
            className={cn('w-full', isFullWidth ? 'lg:w-[92%]' : 'lg:w-90%', isReadOnly ? 'cursor-auto' : 'cursor-pointer')}
            onClick={isReadOnly ? undefined : onPress}
        >
            <div className={cn('flex flex-col p-4 rounded-md', isHighlighted ? 'bg-primary' : 'bg-primary-lighter')}>
                <div className="flex flex-col">
                    <div className="flex items-center justify-between">
                        <div className="flex">
                            {isHighlighted && (
                                <div className="relative mr-2">
                                    <span className="absolute animate-[ping_1.5s_infinite] size-4 rounded-full bg-green-300 opacity-75"></span>
                                    <IconPointFilled className="size-4 text-green-400" />
                                </div>
                            )}
                            <Typography variant="sm" className={cn(wasRejected ? 'line-through' : '', isHighlighted ? 'text-white' : 'text-primary')}>
                                {timeDescriptionText}
                            </Typography>
                        </div>
                        {avatars.length && (
                            <div className="flex">
                                {avatars?.map((type, i) =>
                                    type === 'student' ? (
                                        <StudentAvatar className="size-5 mx-[-3px]" key={`student-${i}`} />
                                    ) : (
                                        <PupilAvatar className="size-5 mx-[-3px]" key={`pupil-${i}`} />
                                    )
                                )}
                            </div>
                        )}
                    </div>
                    <div>
                        <Typography className={cn('font-bold', isHighlighted ? 'text-white' : 'text-primary')}>{displayName}</Typography>

                        {position && (
                            <Typography variant="sm" className={cn('mt-1', isHighlighted ? 'text-white' : 'text-primary')}>
                                {t('appointment.appointmentTile.lecture', { position: position }) +
                                    (title ? t('appointment.appointmentTile.title', { appointmentTitle: title }) : '')}
                            </Typography>
                        )}
                        {wasRejectedByMatch && (
                            <div className="flex gap-x-1 items-center pt-1">
                                <IconInfoCircle className="text-red-600" size={17} />
                                <Typography variant="sm" className="text-red-600">
                                    {t('appointment.appointmentTile.cancelledBy', { name: displayName })}
                                </Typography>
                            </div>
                        )}
                    </div>
                    {isHighlighted && appointmentId && appointmentType && (
                        <VideoButton
                            isInstructor={isOrganizer}
                            canJoin
                            appointmentId={appointmentId}
                            appointmentType={appointmentType}
                            className={cn('w-full lg:w-[300px] mt-4')}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default AppointmentTile;
