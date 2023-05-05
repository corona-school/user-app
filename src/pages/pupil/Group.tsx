import { Text, Heading, useTheme, VStack, useBreakpointValue, Stack } from 'native-base';
import { useTranslation } from 'react-i18next';
import WithNavigation from '../../components/WithNavigation';
import NotificationAlert from '../../components/notifications/NotificationAlert';
import Tabs, { Tab } from '../../components/Tabs';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import AsNavigationItem from '../../components/AsNavigationItem';
import SearchBar from '../../components/SearchBar';
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner';
import { useLazyQuery, useQuery } from '@apollo/client';
import { gql } from '../../gql';
import { sortByDate } from '../../Utility';
import { DateTime } from 'luxon';
import Hello from '../../widgets/Hello';
import MySubcourses from './MySubcourses';
import AllSubcourses from '../subcourse/AllSubcourses';
import { Course_Category_Enum } from '../../gql/graphql';
import HelpNavigation from '../../components/HelpNavigation';

type Props = {};

const query = gql(`
    query PupilSubcourseOverview {
        me {
            pupil {
                canJoinSubcourses {
                    allowed
                    reason
                    limit
                }
                subcoursesJoined {
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

                subcoursesWaitingList {
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
    query PupilPastSubcoursesOverview {
        me {
            pupil {
                canJoinSubcourses {
                    allowed
                    reason
                    limit
                }
                subcoursesJoined(onlyPast: true) {
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

const PupilGroup: React.FC<Props> = () => {
    const { space, sizes } = useTheme();
    const { t } = useTranslation();
    const { trackPageView } = useMatomo();
    const [lastSearch, setLastSearch] = useState<string>('');
    const [activeTab, setActiveTab] = useState<number>(0);
    const { data, loading } = useQuery(query);
    const { data: dataPast, loading: loadingPast } = useQuery(queryPast);

    const ContainerWidth = useBreakpointValue({
        base: '100%',
        lg: sizes['containerWidth'],
    });

    const ContentContainerWidth = useBreakpointValue({
        base: '100%',
        lg: sizes['contentContainerWidth'],
    });

    const [searchAllSubcoursesQuery, { loading: allSubcoursesSearchLoading, data: allSubcoursesData }] = useLazyQuery(
        gql(`
        query GetAllSubcourses($name: String) {
            subcoursesPublic(search: $name, take: 20, excludeKnown: false) {
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
    `)
    );

    useEffect(() => {
        trackPageView({
            documentTitle: 'Schüler Gruppe',
        });

        searchAllSubcoursesQuery({ variables: {} });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const courses = useMemo(() => {
        let arr: Exclude<typeof allSubcoursesData, undefined | null>['subcoursesPublic'];
        switch (activeTab) {
            default:
            case 0:
                arr = allSubcoursesData?.subcoursesPublic || [];
                break;
            case 1:
                arr = data?.me?.pupil?.subcoursesJoined.concat(data?.me?.pupil?.subcoursesWaitingList) || [];
                break;
        }
        return arr;
    }, [activeTab, allSubcoursesData?.subcoursesPublic, data?.me?.pupil?.subcoursesJoined, data?.me?.pupil?.subcoursesWaitingList]);

    const activeCourses = useMemo(
        () =>
            sortByDate(
                courses.filter((course) => {
                    let ok = false;
                    for (const lecture of course.lectures) {
                        const date = DateTime.fromISO(lecture.start).toMillis();
                        const now = DateTime.now().toMillis();
                        if (date > now) {
                            ok = true;
                        }
                    }
                    return ok;
                })
            ),
        [courses]
    );

    const searchResults = useMemo(() => {
        if (lastSearch.length === 0) return activeCourses;
        return (
            (lastSearch.length > 0 && activeTab !== 1 && activeCourses) ||
            activeCourses?.filter((sub) => sub.course.name.toLowerCase().includes(lastSearch.toLowerCase())) ||
            []
        );
    }, [lastSearch, activeTab, activeCourses]);

    const search = useCallback(async () => {
        switch (activeTab) {
            case 0:
                searchAllSubcoursesQuery({ variables: { name: lastSearch } });
                break;
            case 1:
            default:
                break;
        }
    }, [activeTab, lastSearch, searchAllSubcoursesQuery]);

    const languageCourses = useMemo(
        () => sortByDate(searchResults.filter((subcourse) => subcourse.course.category === Course_Category_Enum.Language)),
        [searchResults]
    );
    const focusCourses = useMemo(
        () => sortByDate(searchResults.filter((subcourse) => subcourse.course.category === Course_Category_Enum.Focus)),
        [searchResults]
    );
    const revisionCourses = useMemo(
        () =>
            sortByDate(
                searchResults.filter(
                    (subcourse) => subcourse.course.category !== Course_Category_Enum.Language && subcourse.course.category !== Course_Category_Enum.Focus
                )
            ),
        [searchResults]
    );

    return (
        <AsNavigationItem path="group">
            <WithNavigation
                headerContent={<Hello />}
                headerTitle={t('matching.group.pupil.header')}
                headerLeft={
                    <Stack alignItems="center" direction="row">
                        <HelpNavigation />
                        <NotificationAlert />
                    </Stack>
                }
            >
                {' '}
                {loading && <CenterLoadingSpinner />}
                {!loading && (
                    <VStack paddingX={space['1']} marginBottom={space['1']} marginX="auto" width="100%" maxWidth={ContainerWidth}>
                        <VStack space={space['1']}>
                            <VStack space={space['0.5']} maxWidth={ContentContainerWidth}>
                                <Heading>{t('matching.group.pupil.title')}</Heading>
                                <Text marginBottom={space['0.5']}>{t('matching.group.pupil.content')}</Text>
                            </VStack>

                            <VStack maxWidth={ContentContainerWidth} marginBottom={space['1']}>
                                <SearchBar
                                    value={lastSearch}
                                    onChangeText={(text) => setLastSearch(text)}
                                    onSearch={(s) => {
                                        search();
                                    }}
                                />
                            </VStack>

                            <Tabs
                                onPressTab={(tab: Tab, index: number) => {
                                    setLastSearch('');
                                    setActiveTab(index);
                                }}
                                tabs={[
                                    {
                                        title: t('matching.group.pupil.tabs.tab2.title'),
                                        content: <AllSubcourses languageCourses={languageCourses} courses={revisionCourses} focusCourses={focusCourses} />,
                                    },
                                    {
                                        title: t('matching.group.pupil.tabs.tab1.title'),
                                        content: (
                                            <MySubcourses
                                                currentCourses={searchResults}
                                                pastCourses={dataPast?.me?.pupil?.subcoursesJoined ?? []}
                                                loading={allSubcoursesSearchLoading}
                                            />
                                        ),
                                    },
                                ]}
                            />
                        </VStack>
                    </VStack>
                )}
            </WithNavigation>
        </AsNavigationItem>
    );
};
export default PupilGroup;
