import { Text, Heading, useTheme, VStack, Button, useBreakpointValue } from 'native-base';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import WithNavigation from '../../components/WithNavigation';
import NotificationAlert from '../../components/NotificationAlert';
import AppointmentCard from '../../widgets/AppointmentCard';
import Tabs from '../../components/Tabs';
import { useEffect, useMemo } from 'react';
import { gql } from '../../gql';
import { useQuery } from '@apollo/client';
import { getTrafficStatus, sortByDate } from '../../Utility';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import AsNavigationItem from '../../components/AsNavigationItem';
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner';
import Hello from '../../widgets/Hello';
import AlertMessage from '../../widgets/AlertMessage';
import CSSWrapper from '../../components/CSSWrapper';
import { CreateCourseError } from '../CreateCourse';

const StudentGroup: React.FC = () => {
    const { data, loading } = useQuery(
        gql(`
            query StudentCourseOverview {
                me {
                    student {
                        canCreateCourse {
                            allowed
                            reason
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
                                courseState
                                name
                                description
                                image
                                tags {
                                    id
                                    name
                                }
                            }
                        }
                    }
                }
            }
        `)
    );
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

    const submittedSubcourses = useMemo(
        () => data?.me.student!.subcoursesInstructing.filter((it) => it.course.courseState === 'submitted'),
        [data?.me.student!.subcoursesInstructing]
    );

    const unpublishedOrDraftedSubcourses = useMemo(
        () =>
            data?.me.student!.subcoursesInstructing.filter(
                (it) => it.course.courseState === 'created' || (it.course.courseState === 'allowed' && !it.published)
            ),
        [data?.me.student!.subcoursesInstructing]
    );

    const pastSubcourses = useMemo(
        () =>
            sortByDate(data?.me?.student?.subcoursesInstructing.filter((it) => it.lectures.every((lecture) => lecture.start + lecture.duration < Date.now()))),
        [data?.me?.student?.subcoursesInstructing]
    );

    const publishedSubcourses = useMemo(
        () => sortByDate(data?.me?.student?.subcoursesInstructing.filter((sub) => sub.published && !pastSubcourses.includes(sub))),
        [data?.me?.student?.subcoursesInstructing, pastSubcourses]
    );

    const { trackPageView, trackEvent } = useMatomo();

    useEffect(() => {
        trackPageView({
            documentTitle: 'Helfer Gruppe',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const renderSubcourse = (subcourse: typeof publishedSubcourses[number], index: number, showDate: boolean = true) => {
        return (
            <CSSWrapper className="course-list__item">
                <AppointmentCard
                    showTrafficLight
                    trafficLightStatus={getTrafficStatus(subcourse.participantsCount || 0, subcourse.maxParticipants || 0)}
                    isFullHeight
                    isSpaceMarginBottom={false}
                    key={index}
                    variant="horizontal"
                    description={subcourse.course.description}
                    tags={subcourse.course.tags}
                    date={(showDate && subcourse.firstLecture?.start) || ''}
                    countCourse={subcourse.lectures.length}
                    onPressToCourse={() => navigate(`/single-course/${subcourse.id}`)}
                    image={subcourse.course.image ?? undefined}
                    title={subcourse.course.name}
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
                                                        {((publishedSubcourses?.length ?? 0) > 0 &&
                                                            publishedSubcourses?.map((subcourse, index) => {
                                                                return renderSubcourse(subcourse, index);
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
                                                        {((submittedSubcourses?.length ?? 0) > 0 &&
                                                            submittedSubcourses?.map((subcourse, index) => renderSubcourse(subcourse, index))) || (
                                                            <AlertMessage content={t('empty.coursescheck')} />
                                                        )}
                                                    </CSSWrapper>
                                                </>
                                            ),
                                        },
                                        {
                                            title: t('matching.group.helper.course.tabs.tab3.title'),
                                            content: (
                                                <>
                                                    <CSSWrapper className="course-list__wrapper">
                                                        {((unpublishedOrDraftedSubcourses?.length ?? 0) > 0 &&
                                                            unpublishedOrDraftedSubcourses!.map((subcourse, index) => renderSubcourse(subcourse, index))) || (
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
                                                        {pastSubcourses?.map((subcourse, index) => renderSubcourse(subcourse, index, false)) || (
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
