import { Text, Heading, useTheme, VStack, Button, useBreakpointValue } from 'native-base';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import WithNavigation from '../../components/WithNavigation';
import NotificationAlert from '../../components/notifications/NotificationAlert';
import Tabs from '../../components/Tabs';
import { useEffect, useMemo } from 'react';
import { gql } from '../../gql';
import { useQuery } from '@apollo/client';
import { sortByDate } from '../../Utility';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import AsNavigationItem from '../../components/AsNavigationItem';
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner';
import Hello from '../../widgets/Hello';
import AlertMessage from '../../widgets/AlertMessage';
import { CreateCourseError } from '../CreateCourse';
import { DateTime } from 'luxon';
import CourseGroups from './CourseGroups';
import AllSubcourses from '../subcourse/AllSubcourses';
import { Course_Category_Enum, Subcourse } from '../../gql/graphql';

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
                            cancelled
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
                                category
                                tags {
                                    id
                                    name
                                }
                            }
                        }
                    }
                }

                subcoursesPublic(take: 20) {
                    id
                    published
                    cancelled
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
                        courseState
                        description
                        image
                        category
                        tags {
                            id
                            name
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

    const unpublishedOrDraftedSubcourses = useMemo(
        () =>
            data?.me.student!.subcoursesInstructing.filter(
                (it) => it.course.courseState === 'created' || (it.course.courseState === 'allowed' && !it.published) || it.course.courseState === 'submitted'
            ),
        [data?.me.student]
    );

    const pastSubcourses = useMemo(
        () =>
            sortByDate(
                data?.me?.student?.subcoursesInstructing.filter((it) =>
                    it.lectures.every((lecture) => DateTime.fromISO(lecture.start).toMillis() + lecture.duration * 60000 < DateTime.now().toMillis())
                )
            ),
        [data?.me?.student?.subcoursesInstructing]
    );

    const publishedSubcourses = useMemo(
        () => sortByDate(data?.me?.student?.subcoursesInstructing.filter((sub) => sub.published && !pastSubcourses.includes(sub))),
        [data?.me?.student?.subcoursesInstructing, pastSubcourses]
    );

    const languageCourses = useMemo(
        () => sortByDate(data?.subcoursesPublic?.filter((subcourse) => subcourse.course.category === Course_Category_Enum.Language)),
        [data?.subcoursesPublic]
    );
    const focusCourses = useMemo(
        () => sortByDate(data?.subcoursesPublic?.filter((subcourse) => subcourse.course.category === Course_Category_Enum.Focus)),
        [data?.subcoursesPublic]
    );
    const revisionCourses = useMemo(
        () =>
            sortByDate(
                data?.subcoursesPublic?.filter(
                    (subcourse) => subcourse.course.category !== Course_Category_Enum.Language && subcourse.course.category !== Course_Category_Enum.Focus
                )
            ),
        [data?.subcoursesPublic]
    );

    const { trackPageView, trackEvent } = useMatomo();

    useEffect(() => {
        trackPageView({
            documentTitle: 'Helfer Gruppe',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                                                    ? t('matching.group.helper.alert.successfulEditing')
                                                    : t('matching.group.helper.alert.successfulCreation')
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
                                <Tabs
                                    tabs={[
                                        {
                                            title: t('matching.group.helper.course.tabs.tab1.title'),
                                            content: (
                                                <>
                                                    <CourseGroups
                                                        currentCourses={publishedSubcourses as Subcourse[]}
                                                        draftCourses={unpublishedOrDraftedSubcourses as Subcourse[]}
                                                        pastCourses={pastSubcourses as Subcourse[]}
                                                    />
                                                </>
                                            ),
                                        },
                                        {
                                            title: t('matching.group.helper.course.tabs.tab2.title'),
                                            content: (
                                                <>
                                                    <AllSubcourses
                                                        languageCourses={languageCourses as Subcourse[]}
                                                        courses={revisionCourses as Subcourse[]}
                                                        focusCourses={focusCourses as Subcourse[]}
                                                    />
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
