import { Text, Heading, useTheme, VStack, useBreakpointValue, Stack } from 'native-base';
import { useTranslation } from 'react-i18next';
import WithNavigation from '../../components/WithNavigation';
import NotificationAlert from '../../components/notifications/NotificationAlert';
import NavigationTabs from '../../components/NavigationTabs';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { useCallback, useEffect, useMemo } from 'react';
import AsNavigationItem from '../../components/AsNavigationItem';
import SearchBar from '../../components/SearchBar';
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner';
import { useQuery } from '@apollo/client';
import { gql } from '../../gql';
import { sortByDate } from '../../Utility';
import MySubcourses from './MySubcourses';
import AllSubcourses from '../subcourse/AllSubcourses';
import { Course_Category_Enum } from '../../gql/graphql';
import SwitchLanguageButton from '../../components/SwitchLanguageButton';
import { useBreadcrumbItems } from '@/hooks/useBreadcrumbItems';
import { Breadcrumb } from '@/components/Breadcrumb';

type Props = {};

const query = gql(`
    query PupilSubcourseOverview($search: String) {
        me {
            pupil {
                canJoinSubcourses {
                    allowed
                    reason
                    limit
                }
                subcoursesJoined(search: $search) {
                    id
                    minGrade
                    maxGrade
                    cancelled
                    published
                    isParticipant
                    isOnWaitingList
                    maxParticipants
                    participantsCount
                    firstLecture {
                        start
                        duration
                    }
                    nextLecture {
                        start duration
                    }
                    lectures {
                        start duration
                    }
                    course {
                        name
                        image
                        category
                        tags {
                            name
                        }
                        description
                        courseState
                    }
                }

                subcoursesWaitingList(search: $search) {
                    id
                    minGrade
                    maxGrade
                    isParticipant
                    cancelled
                    published
                    isOnWaitingList
                    maxParticipants
                    participantsCount
                    firstLecture {
                        start
                        duration
                    }
                    nextLecture {
                        start duration
                    }
                    lectures {
                        start duration
                    }
                    course {
                        name
                        image
                        category
                        tags {
                            name
                        }
                        description
                        courseState
                    }
                }
            }
        }
    }
`);

const queryPast = gql(`
    query PupilPastSubcoursesOverview($search: String) {
        me {
            pupil {
                canJoinSubcourses {
                    allowed
                    reason
                    limit
                }
                subcoursesJoined(onlyPast: true, search: $search) {
                    cancelled
                    published
                    isOnWaitingList
                    id
                    isParticipant
                    maxParticipants
                    participantsCount
                    minGrade
                    maxGrade
                    firstLecture {
                        start duration
                    }
                    nextLecture {
                        start duration
                    }
                    lectures {
                        start duration
                    }
                    course {
                        name
                        image
                        category
                        tags {
                            name
                        }
                        description
                        courseState
                    }
                }
            }
        }
    }
`);

const queryPublic = gql(`
query GetAllSubcourses($search: String) {
    subcoursesPublic(search: $search, take: 20, excludeKnown: false) {
        cancelled
        published
        isParticipant
        minGrade
        maxGrade
        maxParticipants
        participantsCount
        id
        isOnWaitingList
        firstLecture {
            start duration
        }
        nextLecture {
            start duration
        }
        lectures {
            start
            duration
        }
        course {
            name
            image
            category
            tags {
                name
            }
            description
            courseState
        }
    }
}
`);

const PupilGroup: React.FC<Props> = () => {
    const { space, sizes } = useTheme();
    const { t } = useTranslation();
    const { trackPageView } = useMatomo();

    const { data, loading, refetch: refetchOverview } = useQuery(query, { variables: { search: '' } });
    const { data: dataPast, refetch: refetchPast } = useQuery(queryPast, { variables: { search: '' } });
    const { loading: allSubcoursesSearchLoading, data: dataPublic, refetch: refetchPublic } = useQuery(queryPublic, { variables: { search: '' } });
    const breadcrumb = useBreadcrumbItems();

    const publicSubcourses = useMemo(() => dataPublic?.subcoursesPublic ?? [], [dataPublic]);
    const subcoursesJoinedOrWaiting = useMemo(() => data?.me?.pupil?.subcoursesJoined.concat(data?.me?.pupil?.subcoursesWaitingList) ?? [], [data]);

    const ContainerWidth = useBreakpointValue({
        base: '100%',
        lg: sizes['containerWidth'],
    });

    const ContentContainerWidth = useBreakpointValue({
        base: '100%',
        lg: sizes['contentContainerWidth'],
    });

    useEffect(() => {
        trackPageView({
            documentTitle: 'Schüler Gruppe',
        });
    }, [trackPageView]);

    const search = useCallback(
        async (search: string) => {
            refetchOverview({ search });
            refetchPast({ search });
            refetchPublic({ search });
        },
        [refetchOverview, refetchPast, refetchPublic]
    );

    const languageCourses = useMemo(
        () => sortByDate(publicSubcourses.filter((subcourse) => subcourse.course.category === Course_Category_Enum.Language)),
        [publicSubcourses]
    );
    const focusCourses = useMemo(
        () => sortByDate(publicSubcourses.filter((subcourse) => subcourse.course.category === Course_Category_Enum.Focus)),
        [publicSubcourses]
    );
    const revisionCourses = useMemo(
        () =>
            sortByDate(
                publicSubcourses.filter(
                    (subcourse) => subcourse.course.category !== Course_Category_Enum.Language && subcourse.course.category !== Course_Category_Enum.Focus
                )
            ),
        [publicSubcourses]
    );

    return (
        <AsNavigationItem path="group">
            <WithNavigation
                headerTitle={t('matching.group.pupil.header')}
                headerLeft={
                    <Stack alignItems="center" direction="row">
                        <SwitchLanguageButton />
                        <NotificationAlert />
                    </Stack>
                }
            >
                {loading && <CenterLoadingSpinner />}
                {!loading && (
                    <VStack paddingX={space['1']} marginBottom={space['1']} marginX="auto" width="100%" maxWidth={ContainerWidth}>
                        <Breadcrumb items={[breadcrumb.COURSES]} className="mb-4" />
                        <VStack space={space['0.5']} maxWidth={ContentContainerWidth}>
                            <Heading>{t('matching.group.pupil.title')}</Heading>
                            <Text marginBottom={space['0.5']}>{t('matching.group.pupil.content')}</Text>
                        </VStack>

                        <VStack maxWidth={ContentContainerWidth} marginBottom={space['1']}>
                            <SearchBar autoSubmit onSearch={search} />
                        </VStack>

                        <NavigationTabs
                            tabs={[
                                {
                                    title: t('matching.group.pupil.tabs.tab2.title'),
                                    content: <AllSubcourses languageCourses={languageCourses} courses={revisionCourses} focusCourses={focusCourses} />,
                                },
                                {
                                    title: t('matching.group.pupil.tabs.tab1.title'),
                                    content: (
                                        <MySubcourses
                                            currentCourses={subcoursesJoinedOrWaiting}
                                            pastCourses={dataPast?.me?.pupil?.subcoursesJoined ?? []}
                                            loading={allSubcoursesSearchLoading}
                                        />
                                    ),
                                },
                            ]}
                        />
                    </VStack>
                )}
            </WithNavigation>
        </AsNavigationItem>
    );
};
export default PupilGroup;
