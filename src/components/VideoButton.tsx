import { useTranslation } from 'react-i18next';
import { Lecture_Appointmenttype_Enum } from '../gql/graphql';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import DisableableButton from './DisablebleButton';
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
    subcourseId?: number;
    matchId?: number;
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
    matchId,
    subcourseId,
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
    const [matchMeetingJoin, { data }] = useMutation(
        gql(`
        mutation JoinMatchMeeting($matchId: Float!) { 
	        matchMeetingJoin(matchId: $matchId)
        }
    `)
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
    const onPress = () => {
        if (appointmentType === Lecture_Appointmenttype_Enum.Match && matchId) matchMeetingJoin({ variables: { matchId } });
        navigate(`/video-chat/${appointmentId}/${appointmentType}`);
    };
    return (
        <DisableableButton
            isDisabled={!canJoinMeeting || isOver}
            reasonDisabled={isInstructor ? t('course.meeting.hint.student') : t('course.meeting.hint.pupil')}
            width={width ?? width}
            onPress={onPress}
        >
            {buttonText ? buttonText : isInstructor ? t('course.meeting.videobutton.student') : t('course.meeting.videobutton.pupil')}
        </DisableableButton>
    );
};

export default VideoButton;
