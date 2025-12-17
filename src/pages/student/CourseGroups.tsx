import { Box, Stack } from 'native-base';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Course_Category_Enum, Subcourse } from '../../gql/graphql';
import { getTrafficStatus, getTrafficStatusText } from '../../Utility';
import AlertMessage from '../../widgets/AlertMessage';
import AppointmentCard from '../../widgets/AppointmentCard';
import HSection from '../../widgets/HSection';

type GroupProps = {
    currentCourses: Subcourse[] | undefined;
    draftCourses: Subcourse[] | undefined;
    pastCourses: Subcourse[] | undefined;
    homeworkHelpCourses: Subcourse[] | undefined;
    onPressDuplicate: (subcourse: Subcourse) => any;
};

const CourseGroups: React.FC<GroupProps> = ({ currentCourses, draftCourses, pastCourses, homeworkHelpCourses, onPressDuplicate }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const renderSubcourse = (subcourse: Subcourse, index: number, showDate: boolean = true, readonly: boolean = false, inPast: boolean = false) => (
        <div key={index}>
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
                trafficLightStatus={getTrafficStatus(subcourse.participantsCount || 0, subcourse.maxParticipants || 0)}
                onPressToCourse={readonly ? undefined : () => navigate(`/single-course/${subcourse.id}`)}
                onPressDuplicate={subcourse.course.category !== Course_Category_Enum.HomeworkHelp ? () => onPressDuplicate(subcourse) : undefined}
                showSchoolclass
            />
        </div>
    );
    return (
        <Stack space={5}>
            <Box>
                {(homeworkHelpCourses?.length ?? 0) > 0 && (
                    <HSection scrollable title={t('matching.group.helper.course.tabs.tab1.homeworkHelp')}>
                        {homeworkHelpCourses?.map((subcourse: any, index: number) => {
                            return renderSubcourse(subcourse, index);
                        })}
                    </HSection>
                )}
            </Box>
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
