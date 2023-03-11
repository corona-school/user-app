import { Box, useTheme } from 'native-base';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner';
import CSSWrapper from '../../components/CSSWrapper';
import { LFSubCourse } from '../../types/lernfair/Course';
import { getTrafficStatus } from '../../Utility';
import AlertMessage from '../../widgets/AlertMessage';
import AppointmentCard from '../../widgets/AppointmentCard';

type GroupProps = {
    courses: LFSubCourse[];
    loading: boolean;
};

const MySubcourses: React.FC<GroupProps> = ({ courses, loading }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { space } = useTheme();

    return (
        <CSSWrapper className="course-list__wrapper">
            {(!loading && (
                <>
                    {(courses?.length &&
                        courses.map((course: LFSubCourse, index: number) => (
                            <CSSWrapper className="course-list__item" key={`subcourse-${index}`}>
                                <AppointmentCard
                                    showTrafficLight={true}
                                    trafficLightStatus={getTrafficStatus(course.participantsCount || 0, course.maxParticipants || 0)}
                                    isHorizontalCardCourseChecked={course.isParticipant}
                                    isSpaceMarginBottom={false}
                                    isFullHeight
                                    variant="horizontal"
                                    description={course.course.description}
                                    tags={course.course.tags}
                                    date={course.firstLecture?.start}
                                    countCourse={course.lectures?.length}
                                    onPressToCourse={() => navigate(`/single-course/${course.id}`)}
                                    image={course.course.image}
                                    title={course.course.name}
                                />
                            </CSSWrapper>
                        ))) || (
                        <Box paddingLeft={space['1']} width="100%">
                            <AlertMessage content={t('matching.group.error.nofound')} />
                        </Box>
                    )}
                </>
            )) || <CenterLoadingSpinner />}
        </CSSWrapper>
    );
};

export default MySubcourses;
