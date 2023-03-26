import { Box, Heading, Stack } from 'native-base';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { LFSubCourse } from '../../types/lernfair/Course';
import { getTrafficStatus, getTrafficStatusText } from '../../Utility';
import AppointmentCard from '../../widgets/AppointmentCard';
import HSection from '../../widgets/HSection';

type GroupProps = {
    currentCourses: LFSubCourse[];
    pastCourses: LFSubCourse[];
    loading: boolean;
};

const MySubcourses: React.FC<GroupProps> = ({ currentCourses, pastCourses, loading }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const renderSubcourse = (
        subcourse: typeof currentCourses[number] | typeof pastCourses[number],
        index: number,
        showDate: boolean = true,
        readonly: boolean = false
    ) => (
        <AppointmentCard
            key={index}
            description={subcourse.course.description}
            tags={subcourse.course.tags}
            date={(showDate && subcourse.firstLecture?.start) || ''}
            image={subcourse.course.image ?? undefined}
            title={subcourse.course.name}
            countCourse={subcourse.lectures.length}
            maxParticipants={subcourse.maxParticipants}
            participantsCount={subcourse.participantsCount}
            minGrade={subcourse.minGrade}
            maxGrade={subcourse.maxGrade}
            statusText={getTrafficStatusText(subcourse)}
            isFullHeight
            showCourseTraffic
            showStatus={subcourse.isInstructor}
            trafficLightStatus={getTrafficStatus(subcourse.participantsCount || 0, subcourse.maxParticipants || 0)}
            onPressToCourse={readonly ? undefined : () => navigate(`/single-course/${subcourse.id}`)}
            showSchoolclass
            isOnWaitinglist={subcourse.isOnWaitingList}
            isHorizontalCardCourseChecked={subcourse.isParticipant || subcourse.isOnWaitingList}
        />
    );

    return (
        <Stack space={5}>
            {currentCourses.length > 0 && (
                <Box>
                    <Heading>{t('matching.group.pupil.tabs.tab2.current')}</Heading>
                    <HSection scrollable>
                        {currentCourses?.map((subcourse: any, index: number) => {
                            return renderSubcourse(subcourse, index, true, false);
                        })}
                    </HSection>
                </Box>
            )}
            {pastCourses.length > 0 && (
                <Box>
                    <Heading>{t('matching.group.pupil.tabs.tab2.past')}</Heading>
                    <HSection scrollable>
                        {pastCourses?.map((subcourse: any, index: number) => {
                            return renderSubcourse(subcourse, index, true, false);
                        })}
                    </HSection>
                </Box>
            )}
        </Stack>
    );
};

export default MySubcourses;
