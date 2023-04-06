import { gql, useMutation } from '@apollo/client';
import { DateTime } from 'luxon';
import { Box, Button, Modal, Tooltip, useTheme } from 'native-base';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Subcourse } from '../../gql/graphql';
import AlertMessage from '../../widgets/AlertMessage';

type JoinMeetingProps = {
    subcourse: Pick<Subcourse, 'id'> & { lectures?: { start: string; duration: number }[] | null };
    isInstructor?: boolean;
    refresh: () => void;
};

const JoinMeeting: React.FC<JoinMeetingProps> = ({ subcourse, isInstructor = false, refresh }) => {
    const [disableMeetingButton, setDisableMeetingButton] = useState(true);
    const [showMeetingNotStarted, setShowMeetingNotStarted] = useState<boolean>();
    const [showJoinedModal, setShowJoinedModal] = useState<boolean>(false);

    const { t } = useTranslation();
    const { space } = useTheme();

    const [joinMeeting, _joinMeeting] = useMutation(
        gql(`mutation SubcourseJoinMeeting($subcourseId: Float!) {
        subcourseJoinMeeting(subcourseId: $subcourseId)
      }`),
        { variables: { subcourseId: subcourse.id } }
    );

    const getMeetingLink = useCallback(async () => {
        const windowRef = window.open(undefined, '_blank');
        try {
            const res = await joinMeeting({ variables: { subcourseId: subcourse.id } });

            if (res.data?.subcourseJoinMeeting) {
                setShowJoinedModal(true);
                if (windowRef) windowRef.location = res.data!.subcourseJoinMeeting;
            } else {
                setShowMeetingNotStarted(true);
                windowRef?.close();
            }
        } catch (e) {
            windowRef?.close();
            setShowMeetingNotStarted(true);
        }
    }, [subcourse, joinMeeting]);

    useEffect(() => {
        setInterval(() => {
            const currentOrNextLecture = subcourse.lectures?.find((lecture) => {
                const minutes = DateTime.fromISO(lecture.start).diffNow('minutes').minutes;
                return minutes < 60 && minutes > -lecture.duration;
            });
            setDisableMeetingButton(!currentOrNextLecture);
        }, 1000);
    }, [subcourse]);

    return (
        <>
            <Tooltip maxWidth={300} label={isInstructor ? t('course.meeting.hint.student') : t('course.meeting.hint.pupil')}>
                <Button onPress={getMeetingLink} isDisabled={_joinMeeting.loading || disableMeetingButton}>
                    {t('single.actions.videochat')}
                </Button>
            </Tooltip>
            {showMeetingNotStarted && <AlertMessage content="Der Videochat wurde noch nicht gestartet." />}
            <Modal isOpen={showJoinedModal} onClose={() => setShowJoinedModal(false)}>
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Body>
                        <Box padding={space['2']}>
                            {t('single.actions.videochatShouldOpen')}
                            <Button href={_joinMeeting.data?.subcourseJoinMeeting}>{t('single.actions.openVideochatAgain')}</Button>
                        </Box>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </>
    );
};

export default JoinMeeting;
