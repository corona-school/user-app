import StudentAvatar from '../assets/icons/lernfair/avatar_student.svg';
import PupilAvatar from '../assets/icons/lernfair/avatar_pupil.svg';
import { AppointmentParticipant, Organizer } from '../gql/graphql';
import { useTranslation } from 'react-i18next';
import { Appointment } from '../types/lernfair/Appointment';
import VideoButton from '../components/VideoButton';
import { IconBook, IconClock, IconCopy, IconHourglass, IconInfoCircle, IconPencil, IconPointFilled, IconTrash } from '@tabler/icons-react';
import { Typography } from '@/components/Typography';
import { cn } from '@/lib/Tailwind';
import { useUser } from '@/hooks/useApollo';
import { useMemo } from 'react';
import AppointmentDate from '@/widgets/AppointmentDate';
import { useCanJoinMeeting } from '@/hooks/useCanJoinMeeting';
import { DateTime } from 'luxon';
import { Button } from '@/components/Button';
import AddToCalendarDropdown from '@/components/AddToCalendarDropdown';
import { Simulate } from 'react-dom/test-utils';
import click = Simulate.click;

type Props = {
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
    onEdit?: () => void;
    onDuplicate?: () => void;
    onDelete?: () => void;
    description?: Appointment['description'];
    duration: Appointment['duration'];
    start: Appointment['start'];
    editable: boolean;
    clickable: boolean;
};

const AppointmentTile: React.FC<Props> = ({
    start,
    duration,
    description,
    isCurrentlyTakingPlace,
    organizers,
    participants,
    isReadOnly,
    isFullWidth,
    onPress,
    position,
    total,
    displayName,
    appointmentId,
    appointmentType,
    isOrganizer,
    wasRejected,
    declinedBy,
    onEdit,
    onDuplicate,
    onDelete,
    title,
    editable,
    clickable,
}) => {
    const { t } = useTranslation();
    const { userID } = useUser();

    const byMatch = !declinedBy?.includes(userID);
    const isHighlighted = !isReadOnly && isCurrentlyTakingPlace && !wasRejected;
    const wasRejectedByMatch = appointmentType === 'match' && wasRejected && byMatch;

    const getAppointmentTimeText = (start: string, duration: number): string => {
        const now = DateTime.now();
        const startDate = DateTime.fromISO(start);
        const end = startDate.plus({ minutes: duration });

        const startTime = startDate.toFormat('T');
        const endTime = end.toFormat('T');

        if (startDate <= now && now <= end) {
            return t('appointment.clock.nowToEnd', { end: endTime });
        }
        return t('appointment.clock.startToEnd', { start: startTime, end: endTime });
    };

    const timeDescriptionText = getAppointmentTimeText(start, duration);
    const avatars = useMemo(() => {
        return [...(organizers?.map((e) => 'student') || []), ...(participants?.map((e) => 'pupil') || [])].slice(0, 5);
    }, [organizers?.length, participants?.length]);

    const isPastAppointment = useMemo(() => {
        return DateTime.fromISO(start).toMillis() + duration * 60000 < DateTime.now().toMillis();
    }, [duration, start]);

    return (
        <div
            className={cn('w-full', isFullWidth ? 'lg:w-[92%]' : 'lg:w-90%', clickable ? 'cursor-pointer' : 'cursor-auto')}
            onClick={clickable ? onPress : undefined}
        >
            <div className={cn('flex flex-col p-4 rounded-md border border-gray-200', isHighlighted && 'bg-primary')}>
                <div className="flex gap-2 mb-2">
                    <AppointmentDate current={isCurrentlyTakingPlace} date={start} isReadOnly={isReadOnly} className="bg-primary-lighter" />
                    <div className="flex flex-col gap-1.5">
                        <div className="flex gap-1.5">
                            <IconClock />
                            <p>{timeDescriptionText}</p>
                        </div>
                        <div className="flex gap-1.5">
                            <IconHourglass />
                            <p>{duration} min</p>
                        </div>
                        <div className="flex gap-1.5">
                            <IconBook />
                            <p>{t('appointment.appointmentTile.lectureWithTotal', { position, total })}</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex">
                        {isHighlighted && (
                            <div className="relative mr-2">
                                <span className="absolute animate-[ping_1.5s_infinite] size-4 rounded-full bg-green-300 opacity-75"></span>
                                <IconPointFilled className="size-4 text-green-400" />
                            </div>
                        )}
                    </div>
                    {avatars.length > 0 && (
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
                    {description && <Typography>{description.length > 100 ? description.slice(0, 100) + '...' : description}</Typography>}
                    {wasRejectedByMatch && (
                        <div className="flex gap-x-1 items-center pt-1">
                            <IconInfoCircle className="text-red-600" size={17} />
                            <Typography variant="sm" className="text-red-600">
                                {t('appointment.appointmentTile.cancelledBy', { name: displayName })}
                            </Typography>
                        </div>
                    )}
                </div>
                {editable && (
                    <div className="flex flex-grow w-full justify-end gap-1 mb-2">
                        {!isReadOnly && (
                            <Button variant="outline" size="icon" className="border rounded-3xl" onClick={onEdit} disabled={!onEdit}>
                                <IconPencil />
                            </Button>
                        )}
                        {!isReadOnly && (
                            <Button variant="outline" size="icon" className="border rounded-3xl" onClick={onDuplicate} disabled={!onDuplicate}>
                                <IconCopy />
                            </Button>
                        )}
                        {!isReadOnly && (
                            <Button variant="outline" size="icon" className="border rounded-3xl" onClick={onDelete} disabled={!onDelete}>
                                <IconTrash />
                            </Button>
                        )}
                    </div>
                )}
                {isHighlighted && appointmentId && appointmentType && (
                    <VideoButton
                        isInstructor={isOrganizer}
                        canJoin
                        appointmentId={appointmentId}
                        appointmentType={appointmentType}
                        className={cn('w-full lg:w-[300px] mt-4')}
                    />
                )}
                {appointmentId && !wasRejected && !declinedBy?.length && !isPastAppointment && !isCurrentlyTakingPlace && (
                    <AddToCalendarDropdown
                        buttonVariant="optional"
                        buttonClasses="w-full lg:w-[300px]"
                        appointment={{ id: appointmentId, displayName, title, start, duration, description: description ?? '' }}
                    />
                )}
            </div>
        </div>
    );
};

export default AppointmentTile;
