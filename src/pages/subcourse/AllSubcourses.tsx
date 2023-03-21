import { Box, Stack } from 'native-base';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Subcourse } from '../../gql/graphql';
import useApollo from '../../hooks/useApollo';
import { LFSubCourse } from '../../types/lernfair/Course';
import { getTrafficStatus } from '../../Utility';
import AppointmentCard from '../../widgets/AppointmentCard';
import HSection from '../../widgets/HSection';

type GroupProps = {
    languageCourses: Subcourse[] | LFSubCourse[];
    courses: Subcourse[] | LFSubCourse[];
    focusCourses: Subcourse[] | LFSubCourse[];
};

const AllSubcourses: React.FC<GroupProps> = ({ languageCourses, courses, focusCourses }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user } = useApollo();

    const renderSubcourse = (
        subcourse: typeof languageCourses[number] | typeof courses[number] | typeof focusCourses[number],
        index: number,
        showDate: boolean = true,
        readonly: boolean = false
    ) => (
        <AppointmentCard
            key={index}
            participantsCount={subcourse.participantsCount}
            maxParticipants={subcourse.maxParticipants}
            minGrade={subcourse.minGrade}
            maxGrade={subcourse.maxGrade}
            isHorizontalCardCourseChecked={subcourse.isParticipant}
            showSchoolclass={user?.pupil ? true : false}
            showCourseTraffic
            trafficLightStatus={getTrafficStatus(subcourse.participantsCount || 0, subcourse.maxParticipants || 0)}
            isFullHeight
            isSpaceMarginBottom={false}
            variant="card"
            description={subcourse.course.description}
            tags={subcourse.course.tags}
            date={(showDate && subcourse.firstLecture?.start) || ''}
            countCourse={subcourse.lectures.length}
            onPressToCourse={readonly ? undefined : () => navigate(`/single-course/${subcourse.id}`)}
            image={subcourse.course.image ?? undefined}
            title={subcourse.course.name}
        />
    );

    return (
        <Stack space={5}>
            {languageCourses.length > 0 && (
                <Box>
                    <HSection scrollable title={t('matching.group.pupil.tabs.tab2.language')}>
                        {languageCourses?.map((subcourse: any, index: number) => {
                            return renderSubcourse(subcourse, index, true, user?.pupil ? false : true);
                        })}
                    </HSection>
                </Box>
            )}
            {courses.length > 0 && (
                <Box>
                    <HSection scrollable title={t('matching.group.pupil.tabs.tab2.courses')}>
                        {courses?.map((subcourse: any, index: number) => {
                            return renderSubcourse(subcourse, index, true, user?.pupil ? false : true);
                        })}
                    </HSection>
                </Box>
            )}
            {focusCourses.length > 0 && (
                <Box>
                    <HSection scrollable title={t('matching.group.pupil.tabs.tab2.focus')}>
                        {focusCourses?.map((subcourse: any, index: number) => {
                            return renderSubcourse(subcourse, index, true, user?.pupil ? false : true);
                        })}
                    </HSection>
                </Box>
            )}
        </Stack>
    );
};

export default AllSubcourses;
