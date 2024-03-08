import { Box, Heading, Stack } from 'native-base';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Course, Course_Tag, Lecture, Subcourse } from '../../gql/graphql';
import { getTrafficStatus, getTrafficStatusText } from '../../Utility';
import AppointmentCard from '../../widgets/AppointmentCard';
import HSection from '../../widgets/HSection';

type MyLecture = Pick<Lecture, 'start' | 'duration'>;
type MyCourse = Pick<Course, 'name' | 'description' | 'image' | 'courseState'> & { tags: Pick<Course_Tag, 'name'>[] };
type MySubcourse = Pick<
    Subcourse,
    'minGrade' | 'maxGrade' | 'participantsCount' | 'maxParticipants' | 'isOnWaitingList' | 'id' | 'isParticipant' | 'published' | 'cancelled'
> & { lectures?: null | MyLecture[]; firstLecture?: null | MyLecture; nextLecture?: null | MyLecture; course: MyCourse };

type GroupProps = {
    currentCourses: MySubcourse[];
    pastCourses: MySubcourse[];
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
            subcourseId={subcourse.id}
            description={subcourse.course!.description}
            tags={subcourse.course!.tags}
            dateNextLecture={(showDate && subcourse.nextLecture?.start) || ''}
            image={subcourse.course!.image ?? undefined}
            title={subcourse.course!.name}
            countCourse={subcourse.lectures!.length}
            maxParticipants={subcourse.maxParticipants}
            participantsCount={subcourse.participantsCount}
            minGrade={subcourse.minGrade}
            maxGrade={subcourse.maxGrade}
            statusText={getTrafficStatusText(subcourse)}
            isFullHeight
            showCourseTraffic
            showStatus={false}
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
