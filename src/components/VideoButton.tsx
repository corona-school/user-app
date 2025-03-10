import { useTranslation } from 'react-i18next';
import { Lecture_Appointmenttype_Enum } from '../gql/graphql';
import { useMutation } from '@apollo/client';
import { gql } from '../gql';
import ZoomMeetingModal from '../modals/ZoomMeetingModal';
import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Button } from './Button';
import { IconVideo } from '@tabler/icons-react';
import { useCanJoinMeeting } from '@/hooks/useCanJoinMeeting';
import { toast } from 'sonner';

type VideoButtonProps = {
    isInstructor?: boolean;
    appointmentId: number;
    appointmentType: Lecture_Appointmenttype_Enum;
    startDateTime?: string;
    duration?: number;
    // canJoin should be given as an override option if there is another rule instead of the 4h / 30 min rule at some point
    canJoin?: boolean;
    width?: number;
    buttonText?: string;
    isOver?: boolean;
    overrideLink?: string;
    className?: string;
};

const VideoButton: React.FC<VideoButtonProps> = ({
    isInstructor = false,
    appointmentId,
    appointmentType,
    startDateTime,
    duration,
    canJoin,
    buttonText,
    className,
    isOver = false,
}) => {
    const { t } = useTranslation();
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const [zoomUrl, setZoomUrl] = useState('');
    const { data, loading: isLoadingOverrideMeetingLink } = useQuery(
        gql(`
        query overrrideLink($appointmentId: Float!) {
            appointment(appointmentId: $appointmentId) {
                override_meeting_link
            }
        }
        `),
        { variables: { appointmentId } }
    );

    const [trackJoinMeeting] = useMutation(
        gql(`
            mutation JoinMeeting($appointmentId: Float!) { 
                appointmentTrackJoin(appointmentId: $appointmentId)
            }
        `)
    );

    const [getZoomMeetingLink, { loading: isLoadingZoomMeetingLink }] = useMutation(
        gql(`
            mutation GetZoomMeetingLink($appointmentId: Float!) { 
                appointmentZoomLinkGet(appointmentId: $appointmentId)
            }
        `)
    );

    const openMeeting = async () => {
        if (!data) return;
        // Technically the user has not joined yet, but they tried, that should be good enough for now
        await trackJoinMeeting({ variables: { appointmentId } });
        const overrideLink = data?.appointment?.override_meeting_link;
        if (overrideLink) {
            window.open(overrideLink, '_blank');
            return;
        }

        const { data: zoomMeetingData } = await getZoomMeetingLink({ variables: { appointmentId } });
        if (zoomMeetingData?.appointmentZoomLinkGet) {
            setZoomUrl(zoomMeetingData.appointmentZoomLinkGet);
            setIsOpenModal(true);
        } else {
            toast.error(t('error'));
        }
    };

    const canStartMeeting = useCanJoinMeeting(isInstructor ? 240 : 10, startDateTime, duration);

    return (
        <>
            <ZoomMeetingModal
                isOpen={isOpenModal}
                onOpenChange={setIsOpenModal}
                appointmentId={appointmentId}
                appointmentType={appointmentType}
                zoomUrl={zoomUrl ?? undefined}
            />
            <Button
                isLoading={isLoadingOverrideMeetingLink || isLoadingZoomMeetingLink}
                disabled={!(canJoin ?? canStartMeeting) || isOver}
                reasonDisabled={isInstructor ? t('course.meeting.hint.student') : t('course.meeting.hint.pupil')}
                onClick={openMeeting}
                className={className}
                leftIcon={<IconVideo size={16} />}
                variant="secondary"
            >
                {buttonText ?? isInstructor ? t('course.meeting.videobutton.student') : t('course.meeting.videobutton.pupil')}
            </Button>
        </>
    );
};

export default VideoButton;
