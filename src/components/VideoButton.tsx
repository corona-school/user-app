import { Button, Tooltip } from 'native-base';
import { useTranslation } from 'react-i18next';
import { Lecture_Appointmenttype_Enum } from '../gql/graphql';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { gql } from '../gql';

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

    const [matchMeetingJoin, { data }] = useMutation(
        gql(`
        mutation JoinMatchMeeting($matchId: Float!) { 
	        matchMeetingJoin(matchId: $matchId)
        }
    `)
    );

    const onPress = () => {
        console.log('MATCH', appointmentType, matchId);
        if (appointmentType === Lecture_Appointmenttype_Enum.Match && matchId) matchMeetingJoin({ variables: { matchId } });
        navigate(`/video-chat/${appointmentId}/${appointmentType}`);
    };

    return (
        <>
            <Tooltip maxW={300} label={isInstructor ? t('course.meeting.hint.student') : t('course.meeting.hint.pupil')} isDisabled={canJoinMeeting || isOver}>
                <Button width={width ?? width} onPress={onPress} isDisabled={!canJoinMeeting || isOver}>
                    {buttonText ? buttonText : isInstructor ? t('course.meeting.videobutton.student') : t('course.meeting.videobutton.pupil')}
                </Button>
            </Tooltip>
        </>
    );
};

export default VideoButton;
