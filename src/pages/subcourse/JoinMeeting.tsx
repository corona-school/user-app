import { Button, Tooltip } from 'native-base';
import { useTranslation } from 'react-i18next';
import { Lecture_Appointmenttype_Enum } from '../../gql/graphql';
import { useNavigate } from 'react-router-dom';

type JoinMeetingProps = {
    appointmentId: number;
    appointmentType: Lecture_Appointmenttype_Enum;
    canJoinMeeting: boolean;
    isInstructor?: boolean;
};

const JoinMeeting: React.FC<JoinMeetingProps> = ({ isInstructor = false, appointmentId, appointmentType, canJoinMeeting }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <>
            <Tooltip maxWidth={300} label={isInstructor ? t('course.meeting.hint.student') : t('course.meeting.hint.pupil')}>
                <Button onPress={() => navigate(`/video-chat/${appointmentId}/${appointmentType}`)} isDisabled={!canJoinMeeting}>
                    {t('single.actions.videochat')}
                </Button>
            </Tooltip>
        </>
    );
};

export default JoinMeeting;
