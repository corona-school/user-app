import { ApolloQueryResult } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Lecture, Subcourse } from '../../../gql/graphql';
import OpenCourseChatButton from '../../subcourse/OpenCourseChatButton';
import VideoButton from '@/components/VideoButton';
import { Button } from '@/components/Button';
import { IconPencil } from '@tabler/icons-react';

type ActionButtonProps = {
    subcourse: Pick<
        Subcourse,
        | 'id'
        | 'participantsCount'
        | 'published'
        | 'isInstructor'
        | 'isMentor'
        | 'conversationId'
        | 'allowChatContactProspects'
        | 'allowChatContactParticipants'
        | 'groupChatType'
    > &
        Partial<Pick<Subcourse, 'canEdit'>>;
    appointment: Lecture;
    refresh: () => Promise<ApolloQueryResult<unknown>>;
    isActiveSubcourse?: boolean;
};

const StudentCourseButtons: React.FC<ActionButtonProps> = ({ subcourse, refresh, appointment, isActiveSubcourse }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <>
            <div className="flex flex-col gap-y-4 md:flex-row md:gap-x-4 md:flex-wrap">
                {subcourse.published && isActiveSubcourse && subcourse.isInstructor && (
                    <OpenCourseChatButton
                        groupChatType={subcourse.groupChatType}
                        conversationId={subcourse.conversationId}
                        subcourseId={subcourse.id}
                        participantsCount={subcourse.participantsCount}
                        isInstructor={subcourse.isInstructor}
                        refresh={refresh}
                        className="w-full  md:w-fit"
                    />
                )}
                {subcourse?.canEdit?.allowed && subcourse.isInstructor && (
                    <>
                        <Button
                            onClick={() => {
                                navigate('/edit-course', {
                                    state: { courseId: subcourse.id },
                                });
                            }}
                            variant="outline"
                            leftIcon={<IconPencil size={16} />}
                            className="w-full  md:w-fit"
                        >
                            {t('single.courseInfo.editCourse')}
                        </Button>
                    </>
                )}
                {subcourse.published && appointment && isActiveSubcourse && (subcourse.isInstructor || subcourse.isMentor) && (
                    <VideoButton
                        isInstructor={subcourse.isInstructor}
                        appointmentId={appointment.id}
                        appointmentType={appointment.appointmentType}
                        startDateTime={appointment.start}
                        duration={appointment.duration}
                        className="w-full  md:w-fit"
                    />
                )}
            </div>
        </>
    );
};

export default StudentCourseButtons;
