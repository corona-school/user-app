import { useTranslation } from 'react-i18next';
import { Lecture_Appointmenttype_Enum } from '../gql/graphql';
import { useNavigate } from 'react-router-dom';
import DisablebleButton from './DisablebleButton';

type VideoButtonProps = {
    isInstructor?: boolean;
    appointmentId: number;
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
    appointmentType,
    width,
    buttonText,
    isOver = false,
}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <DisablebleButton
            isDisabled={!canJoinMeeting || isOver}
            reasonDisabled={isInstructor ? t('course.meeting.hint.student') : t('course.meeting.hint.pupil')}
            width={width ?? width}
            onPress={() => navigate(`/video-chat/${appointmentId}/${appointmentType}`)}
        >
            {buttonText ? buttonText : isInstructor ? t('course.meeting.videobutton.student') : t('course.meeting.videobutton.pupil')}
        </DisablebleButton>
    );
};

export default VideoButton;
