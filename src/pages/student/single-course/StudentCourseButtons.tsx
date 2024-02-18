import { ApolloQueryResult } from '@apollo/client';
import { Button, Stack, useTheme } from 'native-base';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Lecture, Subcourse } from '../../../gql/graphql';
import { useLayoutHelper } from '../../../hooks/useLayoutHelper';
import OpenCourseChatButton from '../../subcourse/OpenCourseChatButton';
import VideoButton from '../../../components/VideoButton';

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
    isActiveSubcourse?: boolean;
};

const StudentCourseButtons: React.FC<ActionButtonProps> = ({ subcourse, refresh, appointment, isActiveSubcourse }) => {
    const { t } = useTranslation();
    const { space } = useTheme();
    const { isMobile } = useLayoutHelper();
    const navigate = useNavigate();

    return (
        <>
            <Stack direction={isMobile ? 'column' : 'row'} space={isMobile ? space['1'] : space['2']}>
                {subcourse.published && isActiveSubcourse && (
                    <OpenCourseChatButton
                        groupChatType={subcourse.groupChatType}
                        conversationId={subcourse.conversationId}
                        subcourseId={subcourse.id}
                        participantsCount={subcourse.participantsCount}
                        isInstructor={subcourse.isInstructor}
                        refresh={refresh}
                    />
                )}
                {subcourse.published && appointment && isActiveSubcourse && (
                    <VideoButton
                        isInstructor
                        appointmentId={appointment.id}
                        appointmentType={appointment.appointmentType}
                        startDateTime={appointment.start}
                        duration={appointment.duration}
                    />
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
