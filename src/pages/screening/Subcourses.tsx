import { Box, Stack } from 'native-base';
import { Course, Subcourse, Course_Tag } from '../../gql/graphql';
import AppointmentCard from '../../widgets/AppointmentCard';
import HSection from '../../widgets/HSection';
import { getTrafficStatus, getTrafficStatusText } from '../../Utility';
import { useNavigate } from 'react-router-dom';

type ASubcourse = Pick<Subcourse, 'id' | 'minGrade' | 'maxGrade' | 'maxParticipants' | 'published' | 'participantsCount' | 'firstLecture' | 'instructors'> & {
    course: Pick<Course, 'name' | 'courseState' | 'image' | 'category'> & { tags: Pick<Course_Tag, 'name'>[] };
};
type Props = {
    courseGroups: ASubcourse[][];
    titles: string[];
};

/**
 *
 * @prop {Array<Array<Subcourse>>} courseGroups - Multiple course groups to be rendered vertically separated on one page,
 * with one course group being an array of courses in this matrix
 * @prop {Array<string>} titles - Titles for each course group, to be placed at the same index here as the course group
 * in courseGroups
 */
const Subcourses: React.FC<Props> = ({ courseGroups, titles }) => {
    const navigate = useNavigate();

    const renderSubcourse = (subcourse: ASubcourse, index: number) => {
        return (
            <AppointmentCard
                key={index}
                description=""
                subcourseId={subcourse.id}
                tags={subcourse.course.tags}
                image={subcourse.course.image?.url ?? undefined}
                title={subcourse.course.name}
                maxParticipants={subcourse.maxParticipants}
                participantsCount={subcourse.participantsCount}
                minGrade={subcourse.minGrade}
                maxGrade={subcourse.maxGrade}
                statusText={getTrafficStatusText(subcourse)}
                isFullHeight
                showCourseTraffic
                showStatus={(subcourse as any)?.isInstructor ?? false}
                trafficLightStatus={getTrafficStatus(subcourse.participantsCount || 0, subcourse.maxParticipants || 0)}
                onPressToCourse={() => navigate(`/single-course/${subcourse.id}`)}
                showSchoolclass
                showInformationForScreeners
                instructors={subcourse.instructors}
                firstLecture={subcourse.firstLecture ? subcourse.firstLecture : undefined}
            />
        );
    };

    const renderCourseGroup = (subcourses: ASubcourse[], title: string) => {
        return (
            <Box>
                <HSection scrollable title={title}>
                    {subcourses.map((subcourse: any, index: number) => {
                        return renderSubcourse(subcourse, index);
                    })}
                </HSection>
            </Box>
        );
    };

    return (
        <Stack space={5}>
            {courseGroups.map((courseGroup: ASubcourse[], index: number) => {
                if (courseGroup.length === 0) return <></>;
                return renderCourseGroup(courseGroup, titles[index]);
            })}
        </Stack>
    );
};

export default Subcourses;
