import { Box, Stack } from 'native-base';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Subcourse } from '../../gql/graphql';
import { getTrafficStatus, getTrafficStatusText } from '../../Utility';
import AlertMessage from '../../widgets/AlertMessage';
import AppointmentCard from '../../widgets/AppointmentCard';
import HSection from '../../widgets/HSection';
import { useState } from 'react';

type SubsetSubcourse = Pick<
    Subcourse,
    'id' | 'course' | 'nextLecture' | 'lectures' | 'maxParticipants' | 'participantsCount' | 'minGrade' | 'maxGrade' | 'isParticipant' | 'updatedAt'
>;

type GroupProps = {
    currentCourses: SubsetSubcourse[] | undefined;
    draftCourses: SubsetSubcourse[] | undefined;
    pastCourses: SubsetSubcourse[] | undefined;
};

const CourseGroups: React.FC<GroupProps> = ({ currentCourses, draftCourses, pastCourses }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [sortedCourses, setSortedCourses] = useState({
        current: currentCourses,
        draft: draftCourses,
        past: pastCourses,
    });

    function sortBy(section: 'current' | 'draft' | 'past' | undefined, value: 'updatedAt' | 'start') {
        if (!section) return;
        setSortedCourses((prev) => ({
            ...prev,
            [section]: [...prev[section]!].sort((a, b) => {
                const getDate = (course: SubsetSubcourse) => new Date(value === 'updatedAt' ? course.updatedAt : course.nextLecture?.start ?? 0).getTime();
                return value === 'updatedAt' ? getDate(b) - getDate(a) : getDate(a) - getDate(b);
            }),
        }));
    }

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
                <HSection scrollable title={t('matching.group.helper.course.tabs.tab1.current')} showSort section={'current'} sortBy={sortBy}>
                    {((sortedCourses.current?.length ?? 0) > 0 &&
                        sortedCourses.current?.map((subcourse: any, index: number) => {
                            return renderSubcourse(subcourse, index);
                        })) || <AlertMessage content={t('course.empty.nocourses')} />}
                </HSection>
            </Box>
            <Box>
                <HSection scrollable title={t('matching.group.helper.course.tabs.tab1.draft')} showSort section={'draft'} sortBy={sortBy}>
                    {((sortedCourses.draft?.length ?? 0) > 0 &&
                        sortedCourses.draft?.map((subcourse: any, index: number) => {
                            return renderSubcourse(subcourse, index);
                        })) || <AlertMessage content={t('course.empty.noremissionordraft')} />}
                </HSection>
            </Box>
            <Box>
                <HSection scrollable title={t('matching.group.helper.course.tabs.tab1.past')} section={'past'} sortBy={sortBy}>
                    {((sortedCourses.past?.length ?? 0) > 0 &&
                        sortedCourses.past?.map((subcourse: any, index: number) => {
                            return renderSubcourse(subcourse, index, true, false, true);
                        })) || <AlertMessage content={t('course.empty.nopastcourses')} />}
                </HSection>
            </Box>
        </Stack>
    );
};

export default CourseGroups;
