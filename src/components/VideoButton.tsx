import { Button, Tooltip } from 'native-base';
import { useTranslation } from 'react-i18next';
import { Lecture_Appointmenttype_Enum } from '../gql/graphql';
import { useNavigate } from 'react-router-dom';

type VideoButtonProps = {
    isInstructor?: boolean;
    appointmentId: number;
    overrideLink?: string;
    appointmentType: Lecture_Appointmenttype_Enum;
    canJoinMeeting: boolean;
    width?: number;
    buttonText?: string;
    isOver?: boolean;
};

const VideoButton: React.FC<VideoButtonProps> = ({
    isInstructor = false,
    canJoinMeeting,
    appointmentId,
    overrideLink,
    appointmentType,
    width,
    buttonText,
    isOver = false,
}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    return (
        <>
            <Tooltip maxW={300} label={isInstructor ? t('course.meeting.hint.student') : t('course.meeting.hint.pupil')} isDisabled={canJoinMeeting || isOver}>
                <Button
                    width={width ?? width}
                    onPress={() =>
                        overrideLink != null ? window.open(overrideLink, '_blank')?.focus() : navigate(`/video-chat/${appointmentId}/${appointmentType}`)
                    }
                    isDisabled={!canJoinMeeting || isOver}
                >
                    {buttonText ? buttonText : isInstructor ? t('course.meeting.videobutton.student') : t('course.meeting.videobutton.pupil')}
                </Button>
            </Tooltip>
        </>
    );
};

export default VideoButton;
