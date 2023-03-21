import { Text, Heading, useTheme, VStack, useBreakpointValue } from 'native-base';
import { useTranslation } from 'react-i18next';
import WithNavigation from '../../components/WithNavigation';
import NotificationAlert from '../../components/notifications/NotificationAlert';
import Tabs, { Tab } from '../../components/Tabs';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import AsNavigationItem from '../../components/AsNavigationItem';
import SearchBar from '../../components/SearchBar';
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner';
import { gql, useLazyQuery, useQuery } from '@apollo/client';
import { LFSubCourse } from '../../types/lernfair/Course';
import { sortByDate } from '../../Utility';
import { DateTime } from 'luxon';
import Hello from '../../widgets/Hello';
import MySubcourses from './MySubcourses';
import AllSubcourses from '../subcourse/AllSubcourses';
import { Course_Category_Enum } from '../../gql/graphql';

type Props = {};

const query = gql`
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
                    isParticipant
                    maxParticipants
                    participantsCount
                    firstLecture {
                        start
                        duration
                    }
                    lectures {
                        start
                    }
                    course {
                        name
                        image
                        category
                        tags {
                            name
                        }
                    }
                }
                subcoursesWaitingList {
                    id
                    isOnWaitingList
                    maxParticipants
                    participantsCount
                    firstLecture {
                        start
                        duration
                    }
                    lectures {
                        start
                    }
                    course {
                        name
                        image
                        category
                        tags {
                            name
                        }
                    }
                }
            }
        }
    }
`;
const queryPast = gql`
    query PupilPastSubcoursesOverview {
        me {
            pupil {
                canJoinSubcourses {
                    allowed
                    reason
                    limit
                }
                subcoursesJoined(onlyPast: true) {
                    id
                    isParticipant
                    maxParticipants
                    participantsCount
                    firstLecture {
                        start
                    }
                    lectures {
                        start
                    }
                    course {
                        name
                        image
                        category
                        tags {
                            name
                        }
                    }
                }
            }
        }
    }
`;

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

    const [searchAllSubcoursesQuery, { loading: allSubcoursesSearchLoading, data: allSubcoursesData }] = useLazyQuery(gql`
        query GetAllSubcourses($name: String) {
            subcoursesPublic(search: $name, take: 20, excludeKnown: false) {
                isParticipant
                maxParticipants
                participantsCount
                id
                firstLecture {
                    start
                }
                lectures {
                    start
                }
                course {
                    name
                    image
                    category
                    tags {
                        name
                    }
                }
            }
        }
    `);

    useEffect(() => {
        trackPageView({
            documentTitle: 'Schüler Gruppe',
        });

        searchAllSubcoursesQuery({ variables: {} });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const courses: LFSubCourse[] = useMemo(() => {
        let arr;
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
    }, [activeTab, allSubcoursesData, data?.me?.pupil?.subcoursesJoined]);

    const activeCourses: LFSubCourse[] = useMemo(
        () =>
            sortByDate(
                courses.filter((course: LFSubCourse) => {
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

    const searchResults: LFSubCourse[] = useMemo(() => {
        if (lastSearch.length === 0) return activeCourses;
        return (
            (lastSearch.length > 0 && activeTab !== 1 && activeCourses) ||
            activeCourses?.filter((sub: LFSubCourse) => sub.course.name.toLowerCase().includes(lastSearch.toLowerCase())) ||
            []
        );
    }, [lastSearch, activeTab, activeCourses]);

    const sortedSearchResults: LFSubCourse[] = useMemo(() => {
        return searchResults;
    }, [searchResults]);

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

    const languageCourses: LFSubCourse[] = useMemo(
        () => sortByDate(sortedSearchResults.filter((subcourse) => subcourse.course.category === Course_Category_Enum.Language)),
        [sortedSearchResults]
    );
    const focusCourses: LFSubCourse[] = useMemo(
        () => sortByDate(sortedSearchResults.filter((subcourse) => subcourse.course.category === Course_Category_Enum.Focus)),
        [sortedSearchResults]
    );
    const revisionCourses: LFSubCourse[] = useMemo(
        () =>
            sortByDate(
                sortedSearchResults.filter(
                    (subcourse) => subcourse.course.category !== Course_Category_Enum.Language && subcourse.course.category !== Course_Category_Enum.Focus
                )
            ),
        [sortedSearchResults]
    );

    return (
        <AsNavigationItem path="group">
            <WithNavigation headerContent={<Hello />} headerTitle={t('matching.group.pupil.header')} headerLeft={<NotificationAlert />}>
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
                                                currentCourses={sortedSearchResults}
                                                pastCourses={dataPast?.me?.pupil?.subcoursesJoined}
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
