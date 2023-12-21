import { Button, Tooltip } from 'native-base';
import { useTranslation } from 'react-i18next';
import { Lecture_Appointmenttype_Enum } from '../gql/graphql';
import { useNavigate } from 'react-router-dom';
import { gql } from '../gql';
import { useLazyQuery } from '@apollo/client';

type VideoButtonProps = {
    isInstructor?: boolean;
    appointmentId: number;
    appointmentType: Lecture_Appointmenttype_Enum;
    canJoinMeeting: boolean;
    width?: number;
    buttonText?: string;
    isOver?: boolean;
    overrideLink?: string;
};

const VideoButton: React.FC<VideoButtonProps> = ({
    isInstructor = false,
    canJoinMeeting,
    appointmentId,
    appointmentType,
    width,
    buttonText,
    isOver = false,
}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [loadLink, { loading }] = useLazyQuery(
        gql(`
query overrrideLink($appointmentId: Float!) {
    appointment(appointmentId: $appointmentId) {
        override_meeting_link
    }
}
`),
        { variables: { appointmentId } }
    );
    const openMeeting = async () => {
        const data = await loadLink();
        const overrideLink = data.data?.appointment?.override_meeting_link;
        if (overrideLink == null) {
            navigate(`/video-chat/${appointmentId}/${appointmentType}`);
        } else {
            window.open(overrideLink, '_self');
        }
    };
    return (
        <>
            <Tooltip maxW={300} label={isInstructor ? t('course.meeting.hint.student') : t('course.meeting.hint.pupil')} isDisabled={canJoinMeeting || isOver}>
                <Button width={width ?? width} onPress={openMeeting} isDisabled={!canJoinMeeting || isOver || loading}>
                    {buttonText ? buttonText : isInstructor ? t('course.meeting.videobutton.student') : t('course.meeting.videobutton.pupil')}
                </Button>
            </Tooltip>
        </>
    );
};

export default VideoButton;
