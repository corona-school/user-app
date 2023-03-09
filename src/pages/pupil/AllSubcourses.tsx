import { Box, Heading, Stack } from 'native-base';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getTrafficStatus } from '../../Utility';
import AppointmentCard from '../../widgets/AppointmentCard';
import HSection from '../../widgets/HSection';

type GroupProps = {
    languageCourses: any;
    courses: any;
    focusCourses: any;
};

const AllSubcourses: React.FC<GroupProps> = ({ languageCourses, courses, focusCourses }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const renderSubcourse = (
        subcourse: typeof languageCourses[number] | typeof languageCourses[number],
        index: number,
        showDate: boolean = true,
        readonly: boolean = false
    ) => (
        <AppointmentCard
            showTrafficLight
            trafficLightStatus={getTrafficStatus(subcourse.participantsCount || 0, subcourse.maxParticipants || 0)}
            isFullHeight
            isSpaceMarginBottom={false}
            key={index}
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
                    <Heading>{t('matching.group.pupil.tabs.tab2.language')}</Heading>
                    <HSection scrollable>
                        {languageCourses?.map((subcourse: any, index: number) => {
                            return renderSubcourse(subcourse, index, true, true);
                        })}
                    </HSection>
                </Box>
            )}
            {courses.length > 0 && (
                <Box>
                    <Heading>{t('matching.group.pupil.tabs.tab2.courses')}</Heading>
                    <HSection scrollable>
                        {courses?.map((subcourse: any, index: number) => {
                            return renderSubcourse(subcourse, index, true, true);
                        })}
                    </HSection>
                </Box>
            )}
            {focusCourses.length > 0 && (
                <Box>
                    <Heading>{t('matching.group.pupil.tabs.tab2.focus')}</Heading>
                    <HSection scrollable>
                        {focusCourses?.map((subcourse: any, index: number) => {
                            return renderSubcourse(subcourse, index, true, true);
                        })}
                    </HSection>
                </Box>
            )}
        </Stack>
    );
};

export default AllSubcourses;
