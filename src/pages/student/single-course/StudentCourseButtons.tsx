import { ApolloQueryResult } from '@apollo/client';
import { Button, Stack, useTheme } from 'native-base';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Subcourse } from '../../../gql/graphql';
import { useLayoutHelper } from '../../../hooks/useLayoutHelper';
import JoinMeeting from '../../subcourse/JoinMeeting';
import ContactParticipants from './ContactParticipants';
import StudentSetMeetingUrl from './StudentSetMeetingUrl';

type ActionButtonProps = {
    subcourse: Subcourse;
    isInPast: boolean;
    refresh: () => Promise<ApolloQueryResult<void>>;
};

const StudentCourseButtons: React.FC<ActionButtonProps> = ({ subcourse, isInPast, refresh }) => {
    const { t } = useTranslation();
    const { space } = useTheme();
    const { isMobile } = useLayoutHelper();
    const navigate = useNavigate();

    return (
        <>
            <Stack direction={isMobile ? 'column' : 'row'} space={isMobile ? space['1'] : space['2']}>
                {subcourse?.isInstructor && (
                    <Button
                        onPress={() => {
                            navigate('/edit-course', {
                                state: { courseId: subcourse.id },
                            });
                        }}
                        variant="outline"
                        // isDisabled={isInPast}
                    >
                        {t('single.courseInfo.editCourse')}
                    </Button>
                )}
                {subcourse.published && (
                    <>
                        <ContactParticipants subcourseId={subcourse.id} refresh={refresh} />
                        <JoinMeeting subcourse={subcourse} refresh={refresh} />
                    </>
                )}
                <StudentSetMeetingUrl subcourseId={subcourse.id} refresh={refresh} />
            </Stack>
        </>
    );
};

export default StudentCourseButtons;
