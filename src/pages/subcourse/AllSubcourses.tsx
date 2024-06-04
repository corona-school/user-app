import { Box, Stack } from 'native-base';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Course, Course_Tag, Lecture, Subcourse } from '../../gql/graphql';
import { getTrafficStatus, getTrafficStatusText } from '../../Utility';
import AppointmentCard from '../../widgets/AppointmentCard';
import HSection from '../../widgets/HSection';

type ALecture = Pick<Lecture, 'start' | 'duration'>;
type ACourse = Pick<Course, 'name' | 'description' | 'image' | 'courseState'> & { tags: Pick<Course_Tag, 'name'>[] };
type ASubcourse = Pick<Subcourse, 'maxParticipants' | 'participantsCount' | 'maxGrade' | 'minGrade' | 'published' | 'cancelled' | 'id'> &
    (Pick<Subcourse, 'isInstructor'> | Pick<Subcourse, 'isParticipant' | 'isOnWaitingList'>) & {
        firstLecture?: null | ALecture;
        nextLecture?: null | ALecture;
        lectures: ALecture[];
        course: ACourse;
    };
type GroupProps = {
    languageCourses: ASubcourse[];
    courses: ASubcourse[];
    focusCourses: ASubcourse[];
};

const AllSubcourses: React.FC<GroupProps> = ({ languageCourses, courses, focusCourses }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const renderSubcourse = (subcourse: ASubcourse, index: number, showDate: boolean = true, readonly: boolean = false) => {
        return (
            <AppointmentCard
                key={index}
                subcourseId={subcourse.id}
                description={subcourse.course.description}
                tags={subcourse.course.tags}
                dateNextLecture={(showDate && subcourse.nextLecture?.start) || ''}
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
                showStatus={(subcourse as any)?.isInstructor ?? false}
                trafficLightStatus={getTrafficStatus(subcourse.participantsCount || 0, subcourse.maxParticipants || 0)}
                onPressToCourse={readonly ? undefined : () => navigate(`/single-course/${subcourse.id}`)}
                showSchoolclass={((subcourse as any)?.isInstructor || (subcourse as any)?.isParticipant) ?? false}
                isHorizontalCardCourseChecked={((subcourse as any)?.isParticipant ?? false) || ((subcourse as any)?.isOnWaitingList ?? false)}
                isOnWaitinglist={!!((subcourse as any)?.isOnWaitingList ?? false)}
            />
        );
    };

    return (
        <Stack space={5}>
            {focusCourses && focusCourses.length > 0 && (
                <Box>
                    <HSection scrollable title={t('matching.group.pupil.tabs.tab2.focus')}>
                        {focusCourses?.map((subcourse: any, index: number) => {
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
            {languageCourses && languageCourses.length > 0 && (
                <Box>
                    <HSection scrollable title={t('matching.group.pupil.tabs.tab2.language')}>
                        {languageCourses?.map((subcourse: any, index: number) => {
                            return renderSubcourse(subcourse, index, true);
                        })}
                    </HSection>
                </Box>
            )}
        </Stack>
    );
};

export default AllSubcourses;
