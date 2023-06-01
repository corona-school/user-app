import { ApolloQueryResult } from '@apollo/client';
import { Button, Stack, useTheme } from 'native-base';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useLayoutHelper } from '../../../hooks/useLayoutHelper';
import JoinMeeting from '../../subcourse/JoinMeeting';
import ContactParticipants from './ContactParticipants';
import StudentSetMeetingUrl from './StudentSetMeetingUrl';
import OpenSubcourseChat from '../../subcourse/OpenSubcourseChat';

type SubcourseOfStudent = {
    id: number;
    participantsCount: number;
    published: boolean;
    isInstructor: boolean;
    canCancel: { allowed: boolean };
    canContactParticipants: { allowed: boolean };
    canEdit: { allowed: boolean };
    conversationId?: string | null | undefined;
};

type ActionButtonProps = {
    subcourse: SubcourseOfStudent;
    refresh: () => Promise<ApolloQueryResult<unknown>>;
};

const StudentCourseButtons: React.FC<ActionButtonProps> = ({ subcourse, refresh }) => {
    const { t } = useTranslation();
    const { space } = useTheme();
    const { isMobile } = useLayoutHelper();
    const navigate = useNavigate();

    return (
        <>
            <Stack direction={isMobile ? 'column' : 'row'} space={isMobile ? space['1'] : space['2']}>
                {subcourse.published && <JoinMeeting subcourse={subcourse} isInstructor refresh={refresh} />}
                {subcourse.published && subcourse.canContactParticipants.allowed && <ContactParticipants subcourseId={subcourse.id} refresh={refresh} />}
                {subcourse.published && (
                    <OpenSubcourseChat
                        conversationId={subcourse.conversationId}
                        subcourseId={subcourse.id}
                        participantsCount={subcourse.participantsCount}
                        refresh={refresh}
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
                        <StudentSetMeetingUrl subcourseId={subcourse.id} refresh={refresh} />
                    </>
                )}
            </Stack>
        </>
    );
};

export default StudentCourseButtons;
