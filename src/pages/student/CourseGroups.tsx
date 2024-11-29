import { Box, Stack } from 'native-base';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Subcourse } from '../../gql/graphql';
import { getTrafficStatus, getTrafficStatusText } from '../../Utility';
import AlertMessage from '../../widgets/AlertMessage';
import AppointmentCard from '../../widgets/AppointmentCard';
import HSection from '../../widgets/HSection';

type SubsetSubcourse = Pick<
    Subcourse,
    'id' | 'course' | 'nextLecture' | 'lectures' | 'maxParticipants' | 'participantsCount' | 'minGrade' | 'maxGrade' | 'isParticipant'
>;

type GroupProps = {
    currentCourses: SubsetSubcourse[] | undefined;
    draftCourses: SubsetSubcourse[] | undefined;
    pastCourses: SubsetSubcourse[] | undefined;
};

const CourseGroups: React.FC<GroupProps> = ({ currentCourses, draftCourses, pastCourses }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const renderSubcourse = (subcourse: SubsetSubcourse, index: number, showDate: boolean = true, readonly: boolean = false, inPast: boolean = false) => (
        <div>
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
                showStatus={!subcourse.isParticipant}
                trafficLightStatus={getTrafficStatus(subcourse.participantsCount || 0, subcourse.maxParticipants || 0)}
                onPressToCourse={readonly ? undefined : () => navigate(`/single-course/${subcourse.id}`)}
                showSchoolclass
                isHorizontalCardCourseChecked={subcourse.isParticipant}
            />
        </div>
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
