import { ApolloQueryResult } from '@apollo/client';
import { Button, Stack, useTheme } from 'native-base';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Lecture } from '../../../gql/graphql';
import { useLayoutHelper } from '../../../hooks/useLayoutHelper';
import ContactParticipants from './ContactParticipants';
import { canJoinMeeting } from '../../../widgets/appointment/AppointmentDay';
import { DateTime } from 'luxon';
import { useMemo } from 'react';
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
    subcourse: SubcourseOfStudent;
    appointment?: Lecture;
    refresh: () => Promise<ApolloQueryResult<unknown>>;
};

const StudentCourseButtons: React.FC<ActionButtonProps> = ({ subcourse, refresh, appointment }) => {
    const { t } = useTranslation();
    const { space } = useTheme();
    const { isMobile } = useLayoutHelper();
    const navigate = useNavigate();

    const canJoin = useMemo(() => {
        if (!appointment) return false;
        return canJoinMeeting(appointment.start, appointment.duration || 0, 30, DateTime.now());
    }, [appointment]);

    return (
        <>
            <Stack direction={isMobile ? 'column' : 'row'} space={isMobile ? space['1'] : space['2']}>
                {subcourse.published && appointment && (
                    <VideoButton isInstructor appointmentId={appointment.id} appointmentType={appointment.appointmentType} canStartMeeting={canJoin} />
                )}
                {subcourse.published && subcourse.canContactParticipants.allowed && <ContactParticipants subcourseId={subcourse.id} refresh={refresh} />}
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
