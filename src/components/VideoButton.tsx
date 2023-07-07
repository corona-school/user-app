import { DateTime } from 'luxon';
import { Button, useTheme } from 'native-base';
import { useTranslation } from 'react-i18next';
import { canJoinMeeting } from '../widgets/appointment/AppointmentDay';

type VideoButtonProps = {
    appointmentId: number;
    start: string;
    duration: number;
    isOrganizer?: boolean;
    joinMeeting: () => void;
};

const VideoButton: React.FC<VideoButtonProps> = ({ appointmentId, start, duration, isOrganizer, joinMeeting }) => {
    const { space } = useTheme();
    const { t } = useTranslation();

    return (
        <>
            <Button
                width="100%"
                marginTop={space['1']}
                onPress={joinMeeting}
                isDisabled={!appointmentId || !canJoinMeeting(start, duration, isOrganizer ? 30 : 10, DateTime.now())}
            >
                {t('course.meeting.videobutton.pupil')}
            </Button>
        </>
    );
};

export default VideoButton;
