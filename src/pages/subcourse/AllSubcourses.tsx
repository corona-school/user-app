import { Box, Stack } from 'native-base';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { LFSubCourse } from '../../types/lernfair/Course';
import { getTrafficStatus, getTrafficStatusText } from '../../Utility';
import AppointmentCard from '../../widgets/AppointmentCard';
import HSection from '../../widgets/HSection';

type GroupProps = {
    languageCourses: LFSubCourse[];
    courses: LFSubCourse[];
    focusCourses: LFSubCourse[];
};

const AllSubcourses: React.FC<GroupProps> = ({ languageCourses, courses, focusCourses }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const renderSubcourse = (subcourse: LFSubCourse, index: number, showDate: boolean = true, readonly: boolean = false) => {
        return (
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
                isHorizontalCardCourseChecked={subcourse.isParticipant || subcourse.isOnWaitingList}
                isOnWaitinglist={!!subcourse.isOnWaitingList}
            />
        );
    };

    return (
        <Stack space={5}>
            {languageCourses && languageCourses.length > 0 && (
                <Box>
                    <HSection scrollable title={t('matching.group.pupil.tabs.tab2.language')}>
                        {languageCourses?.map((subcourse: any, index: number) => {
                            return renderSubcourse(subcourse, index, true);
                        })}
                    </HSection>
                </Box>
            )}
            {courses && courses.length > 0 && (
                <Box>
                    <HSection scrollable title={t('matching.group.pupil.tabs.tab2.courses')}>
                        {courses?.map((subcourse: any, index: number) => {
                            return renderSubcourse(subcourse, index, true);
                        })}
                    </HSection>
                </Box>
            )}
            {focusCourses && focusCourses.length > 0 && (
                <Box>
                    <HSection scrollable title={t('matching.group.pupil.tabs.tab2.focus')}>
                        {focusCourses?.map((subcourse: any, index: number) => {
                            return renderSubcourse(subcourse, index, true);
                        })}
                    </HSection>
                </Box>
            )}
        </Stack>
    );
};

export default AllSubcourses;
