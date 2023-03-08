import { Box, Heading, Stack } from 'native-base';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getTrafficStatus } from '../../Utility';
import AlertMessage from '../../widgets/AlertMessage';
import AppointmentCard from '../../widgets/AppointmentCard';
import HSection from '../../widgets/HSection';

type GroupProps = {
    currentCourses: any;
    draftCourses: any;
    pastCourses: any;
};

const CourseGroups: React.FC<GroupProps> = ({ currentCourses, draftCourses, pastCourses }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const renderSubcourse = (
        subcourse: typeof currentCourses[number] | typeof currentCourses[number],
        index: number,
        showDate: boolean = true,
        readonly: boolean = false
    ) => (
        <AppointmentCard
            key={index}
            showTrafficLight
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
                            return renderSubcourse(subcourse, index);
                        })) || <AlertMessage content={t('course.empty.nopastcourses')} />}
                </HSection>
            </Box>
        </Stack>
    );
};

export default CourseGroups;
