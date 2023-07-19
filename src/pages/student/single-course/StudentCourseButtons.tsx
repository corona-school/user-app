import { ApolloQueryResult } from '@apollo/client';
import { Button, Stack, useTheme } from 'native-base';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Lecture, Subcourse } from '../../../gql/graphql';
import { useLayoutHelper } from '../../../hooks/useLayoutHelper';
import { canJoinMeeting } from '../../../widgets/appointment/AppointmentDay';
import { DateTime } from 'luxon';
import { useMemo } from 'react';
import OpenCourseChatButton from '../../subcourse/OpenCourseChatButton';
import ContactParticipants from './ContactParticipants';
import VideoButton from '../../../components/VideoButton';

type SubcourseOfStudent = {
    id: number;
    published: boolean;
    isInstructor: boolean;
    canCancel: { allowed: boolean };
    canContactParticipants: { allowed: boolean };
    canEdit: { allowed: boolean };
};

type ActionButtonProps = {
    subcourse: Pick<
        Subcourse,
        | 'id'
        | 'participantsCount'
        | 'published'
        | 'isInstructor'
        | 'canCancel'
        | 'canContactParticipants'
        | 'canEdit'
        | 'conversationId'
        | 'allowChatContactProspects'
        | 'allowChatContactParticipants'
        | 'groupChatType'
    >;
    appointment: Lecture;
    refresh: () => Promise<ApolloQueryResult<unknown>>;
};

const StudentCourseButtons: React.FC<ActionButtonProps> = ({ subcourse, refresh, appointment }) => {
    const { t } = useTranslation();
    const { space } = useTheme();
    const { isMobile } = useLayoutHelper();
    const navigate = useNavigate();

    const canJoin = useMemo(() => {
        if (!appointment) return false;
        return canJoinMeeting(appointment.start, appointment.duration, 30, DateTime.now());
    }, []);

    return (
        <>
            <Stack direction={isMobile ? 'column' : 'row'} space={isMobile ? space['1'] : space['2']}>
                {subcourse.published && (
                    <OpenCourseChatButton
                        groupChatType={subcourse.groupChatType}
                        conversationId={subcourse.conversationId}
                        subcourseId={subcourse.id}
                        participantsCount={subcourse.participantsCount}
                        isInstructor={subcourse.isInstructor}
                        refresh={refresh}
                    />
                )}
                {subcourse.published && appointment && (
                    <VideoButton isInstructor appointmentId={appointment.id} appointmentType={appointment.appointmentType} canStartMeeting={canJoin} />
                )}
                {subcourse.canEdit.allowed && (
                    <>
                        <Button
                            onPress={() => {
                                navigate('/edit-course', {
                                    state: { courseId: subcourse.id },
                                });
                            }}
                            variant="outline"
                        >
                            {t('single.courseInfo.editCourse')}
                        </Button>
                    </>
                )}
            </Stack>
        </>
    );
};

export default StudentCourseButtons;
