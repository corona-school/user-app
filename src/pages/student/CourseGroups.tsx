import { Box, Heading, Stack } from 'native-base';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { LFSubCourse } from '../../types/lernfair/Course';
import { getTrafficStatus, getTrafficStatusText } from '../../Utility';
import AlertMessage from '../../widgets/AlertMessage';
import AppointmentCard from '../../widgets/AppointmentCard';
import HSection from '../../widgets/HSection';

type GroupProps = {
    currentCourses: LFSubCourse[] | undefined;
    draftCourses: LFSubCourse[] | undefined;
    pastCourses: LFSubCourse[] | undefined;
};

const CourseGroups: React.FC<GroupProps> = ({ currentCourses, draftCourses, pastCourses }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const renderSubcourse = (subcourse: LFSubCourse, index: number, showDate: boolean = true, readonly: boolean = false, inPast: boolean = false) => (
        <AppointmentCard
            key={index}
            showCourseTraffic={subcourse.published && inPast}
            showStatus={!inPast}
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
                <HSection scrollable title={t('matching.group.helper.course.tabs.tab1.current')}>
                    {((currentCourses?.length ?? 0) > 0 &&
                        currentCourses?.map((subcourse: any, index: number) => {
                            return renderSubcourse(subcourse, index);
                        })) || <AlertMessage content={t('course.empty.nocourses')} />}
                </HSection>
            </Box>
            <Box>
                <HSection scrollable title={t('matching.group.helper.course.tabs.tab1.draft')}>
                    {((draftCourses?.length ?? 0) > 0 &&
                        draftCourses?.map((subcourse: any, index: number) => {
                            return renderSubcourse(subcourse, index);
                        })) || <AlertMessage content={t('course.empty.noremissionordraft')} />}
                </HSection>
            </Box>
            <Box>
                <HSection scrollable title={t('matching.group.helper.course.tabs.tab1.past')}>
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
