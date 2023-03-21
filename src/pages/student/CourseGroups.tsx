import { Box, Heading, Stack } from 'native-base';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Course_Coursestate_Enum, Subcourse } from '../../gql/graphql';
import { LFSubCourse } from '../../types/lernfair/Course';
import { getTrafficStatus } from '../../Utility';
import AlertMessage from '../../widgets/AlertMessage';
import AppointmentCard from '../../widgets/AppointmentCard';
import HSection from '../../widgets/HSection';

type GroupProps = {
    currentCourses: Subcourse[];
    draftCourses: Subcourse[];
    pastCourses: Subcourse[];
};

const CourseGroups: React.FC<GroupProps> = ({ currentCourses, draftCourses, pastCourses }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const getTrafficStatusText = (subcourse: Subcourse | LFSubCourse): string => {
        if (subcourse.published) return t('single.global.courseState.publish');
        if (subcourse.cancelled) return t('single.global.courseState.cancelled');
        if (subcourse.course.courseState === Course_Coursestate_Enum.Created) return t('single.global.courseState.draft');
        if (subcourse.course.courseState === Course_Coursestate_Enum.Submitted) return t('single.global.courseState.submitted');
        return t('single.global.courseState.publish');
    };

    const renderSubcourse = (
        subcourse: typeof currentCourses[number] | typeof draftCourses[number] | typeof pastCourses[number],
        index: number,
        showDate: boolean = true,
        readonly: boolean = false,
        inPast: boolean = false
    ) => (
        <AppointmentCard
            key={index}
            showCourseTraffic={subcourse.published && !inPast ? true : false}
            showStatus={inPast ? false : true}
            participantsCount={subcourse.participantsCount}
            maxParticipants={subcourse.maxParticipants}
            minGrade={subcourse.minGrade}
            maxGrade={subcourse.maxGrade}
            trafficLightStatus={getTrafficStatus(subcourse.participantsCount || 0, subcourse.maxParticipants || 0)}
            statusText={getTrafficStatusText(subcourse)}
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
            <Box>
                <Heading>{t('matching.group.helper.course.tabs.tab1.current')}</Heading>
                <HSection scrollable>
                    {((currentCourses?.length ?? 0) > 0 &&
                        currentCourses?.map((subcourse: any, index: number) => {
                            return renderSubcourse(subcourse, index);
                        })) || <AlertMessage content={t('course.empty.nocourses')} />}
                </HSection>
            </Box>
            <Box>
                <Heading>{t('matching.group.helper.course.tabs.tab1.draft')}</Heading>
                <HSection scrollable>
                    {((draftCourses?.length ?? 0) > 0 &&
                        draftCourses?.map((subcourse: any, index: number) => {
                            return renderSubcourse(subcourse, index);
                        })) || <AlertMessage content={t('course.empty.noremissionordraft')} />}
                </HSection>
            </Box>
            <Box>
                <Heading>{t('matching.group.helper.course.tabs.tab1.past')}</Heading>
                <HSection scrollable>
                    {((pastCourses?.length ?? 0) > 0 &&
                        pastCourses?.map((subcourse: any, index: number) => {
                            return renderSubcourse(subcourse, index, true, false, true);
                        })) || <AlertMessage content={t('course.empty.nopastcourses')} />}
                </HSection>
            </Box>
        </Stack>
    );
};

export default CourseGroups;
