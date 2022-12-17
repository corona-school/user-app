import { Text, Heading, useTheme, VStack, Button, useBreakpointValue } from 'native-base';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import WithNavigation from '../../components/WithNavigation';
import NotificationAlert from '../../components/NotificationAlert';
import AppointmentCard from '../../widgets/AppointmentCard';
import Tabs from '../../components/Tabs';
import { useEffect, useMemo } from 'react';
import { gql, useQuery } from '@apollo/client';
import { LFSubCourse } from '../../types/lernfair/Course';
import { getTrafficStatus, sortByDate } from '../../Utility';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import AsNavigationItem from '../../components/AsNavigationItem';
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner';
import { DateTime } from 'luxon';
import Hello from '../../widgets/Hello';
import AlertMessage from '../../widgets/AlertMessage';
import CSSWrapper from '../../components/CSSWrapper';
import { CreateCourseError } from '../CreateCourse';

const query = gql`
    query {
        me {
            student {
                canCreateCourse {
                    allowed
                    reason
                }
                coursesInstructing {
                    id
                    name
                    description
                    tags {
                        name
                    }
                }
                subcoursesInstructing {
                    id
                    published
                    participantsCount
                    maxParticipants
                    firstLecture {
                        start
                        duration
                    }
                    lectures {
                        start
                        duration
                    }
                    course {
                        name
                        description
                        tags {
                            name
                        }
                    }
                }
            }
        }
    }
`;

const StudentGroup: React.FC = () => {
    const { data, loading } = useQuery(query);
    const { space, sizes } = useTheme();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const location = useLocation();
    const locState = location?.state as {
        errors: CreateCourseError[];
        wasEdited: boolean;
    };

    const ContainerWidth = useBreakpointValue({
        base: '100%',
        lg: sizes['containerWidth'],
    });

    const ButtonContainer = useBreakpointValue({
        base: '100%',
        lg: sizes['desktopbuttonWidth'],
    });

    const submittedSubcourses: LFSubCourse[] = useMemo(
        () => sortByDate(data?.me?.student?.subcoursesInstructing.filter((sub: LFSubCourse) => !sub.published)),
        [data?.me?.student?.subcoursesInstructing]
    );

    const pastCourses: LFSubCourse[] = useMemo(
        () =>
            sortByDate(
                data?.me?.student?.subcoursesInstructing.filter((course: LFSubCourse) => {
                    let ok = true;
                    if (!course.lectures) return false;
                    for (const lecture of course.lectures) {
                        if (DateTime.fromISO(lecture.start).toMillis() < DateTime.now().toMillis()) {
                            continue;
                        } else {
                            ok = false;
                            break;
                        }
                    }
                    return ok;
                })
            ),
        [data?.me?.student?.subcoursesInstructing]
    );

    const publishedSubcourses: LFSubCourse[] = useMemo(
        () => sortByDate(data?.me?.student?.subcoursesInstructing.filter((sub: LFSubCourse) => sub.published && !pastCourses.includes(sub))),
        [data?.me?.student?.subcoursesInstructing, pastCourses]
    );

    const { trackPageView, trackEvent } = useMatomo();

    useEffect(() => {
        trackPageView({
            documentTitle: 'Helfer Gruppe',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const renderSubcourse = (course: LFSubCourse, index: number, showDate: boolean = true) => {
        return (
            <CSSWrapper className="course-list__item">
                <AppointmentCard
                    showTrafficLight
                    trafficLightStatus={getTrafficStatus(course.participantsCount || 0, course.maxParticipants || 0)}
                    isFullHeight
                    isSpaceMarginBottom={false}
                    key={index}
                    variant="horizontal"
                    description={course.course.description}
                    tags={course.course.tags}
                    date={(showDate && course.firstLecture?.start) || ''}
                    countCourse={course.lectures.length}
                    onPressToCourse={() => navigate(`/single-course/${course.id}`)}
                    image={course.course.image}
                    title={course.course.name}
                />
            </CSSWrapper>
        );
    };

    const showSuccess = useMemo(() => {
        if (locState?.errors) {
            return locState.errors.filter((error: CreateCourseError) => error === 'course' || error === 'subcourse').length === 0;
        }
        return false;
    }, [locState?.errors]);

    return (
        <AsNavigationItem path="group">
            <WithNavigation headerContent={<Hello />} headerTitle={t('matching.group.helper.header')} headerLeft={<NotificationAlert />}>
                <VStack paddingX={space['1']} marginX="auto" marginBottom={space['1']} maxWidth={ContainerWidth} width="100%">
                    {loading && <CenterLoadingSpinner />}

                    {!loading && (
                        <VStack space={space['1']}>
                            <VStack space={space['0.5']}>
                                <Heading>{t('matching.group.helper.title')}</Heading>
                                <Text>{t('matching.group.helper.content')}</Text>
                            </VStack>
                            <VStack>
                                <Heading fontSize="md" marginBottom="5px">
                                    {t('matching.group.helper.contentHeadline')}
                                </Heading>
                                <Text>{t('matching.group.helper.contentHeadlineContent')}</Text>
                            </VStack>
                            {locState && Object.keys(locState).length > 0 && (
                                <>
                                    {showSuccess && (
                                        <AlertMessage
                                            content={
                                                locState.wasEdited
                                                    ? 'Dein Kurs wurde erfolgreich bearbeitet.'
                                                    : 'Dein Kurs wurde erfolgreich erstellt. Er befindet sich nun in Prüfung.'
                                            }
                                        />
                                    )}
                                    {(locState?.errors?.length > 0 && (
                                        <>
                                            {locState.errors.map((e) => (
                                                <AlertMessage content={t(`course.error.${e}`)} />
                                            ))}
                                        </>
                                    )) || <></>}
                                </>
                            )}
                            <VStack paddingY={space['1']}>
                                <Button
                                    width={ButtonContainer}
                                    onPress={() => {
                                        trackEvent({
                                            category: 'matching',
                                            action: 'click-event',
                                            name: 'Helfer Matching Gruppen – Kurs erstellen',
                                            documentTitle: 'Matching Gruppen Lernunterstützung Kurs erstellen',
                                        });
                                        navigate('/create-course');
                                    }}
                                >
                                    {t('matching.group.helper.button')}
                                </Button>
                            </VStack>

                            <VStack>
                                <Heading marginBottom={space['1.5']}>{t('matching.group.helper.course.title')}</Heading>
                                <Tabs
                                    tabs={[
                                        {
                                            title: t('matching.group.helper.course.tabs.tab1.title'),
                                            content: (
                                                <>
                                                    <CSSWrapper className="course-list__wrapper">
                                                        {(publishedSubcourses?.length > 0 &&
                                                            publishedSubcourses?.map((sub: LFSubCourse, index: number) => {
                                                                return renderSubcourse(sub, index);
                                                            })) || <AlertMessage content={t('empty.courses')} />}
                                                    </CSSWrapper>
                                                </>
                                            ),
                                        },
                                        {
                                            title: t('matching.group.helper.course.tabs.tab2.title'),
                                            content: (
                                                <>
                                                    <CSSWrapper className="course-list__wrapper">
                                                        {(submittedSubcourses?.length > 0 &&
                                                            submittedSubcourses?.map((sub: LFSubCourse, index: number) => renderSubcourse(sub, index))) || (
                                                            <AlertMessage content={t('empty.coursescheck')} />
                                                        )}
                                                    </CSSWrapper>
                                                </>
                                            ),
                                        },

                                        {
                                            title: t('matching.group.helper.course.tabs.tab4.title'),
                                            content: (
                                                <>
                                                    <CSSWrapper className="course-list__wrapper">
                                                        {pastCourses?.map((course: LFSubCourse, index) => renderSubcourse(course, index, false)) || (
                                                            <AlertMessage content={t('empty.courses')} />
                                                        )}
                                                    </CSSWrapper>
                                                </>
                                            ),
                                        },
                                    ]}
                                />
                            </VStack>
                        </VStack>
                    )}
                </VStack>
            </WithNavigation>
        </AsNavigationItem>
    );
};
export default StudentGroup;
