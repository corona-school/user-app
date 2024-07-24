import { ApolloQueryResult } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Lecture, Subcourse } from '../../../gql/graphql';
import OpenCourseChatButton from '../../subcourse/OpenCourseChatButton';
import VideoButton from '@/components/VideoButton';
import { Button } from '@/components/atoms/Button';

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
    const navigate = useNavigate();

    return (
        <>
            <div className="flex flex-col gap-y-4 md:flex-row md:gap-x-4">
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
                        className="w-full"
                    />
                )}
                {subcourse.canEdit.allowed && (
                    <>
                        <Button
                            onClick={() => {
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
            </div>
        </>
    );
};

export default StudentCourseButtons;
