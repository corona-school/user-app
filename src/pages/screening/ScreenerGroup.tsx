import { useTranslation } from 'react-i18next';
import AsNavigationItem from '../../components/AsNavigationItem';
import WithNavigation from '../../components/WithNavigation';
import { Heading, VStack, useBreakpointValue, useTheme } from 'native-base';
import NavigationTabs from '../../components/NavigationTabs';
import SearchBar from '../../components/SearchBar';
import { useQuery } from '@apollo/client';
import { gql } from '../../gql';
import Subcourses from './Subcourses';
import { useCallback } from 'react';
import { Course_Coursestate_Enum, Subcourse } from '../../gql/graphql';
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner';

const ScreenerGroup: React.FC = () => {
    const { space, sizes } = useTheme();
    const { t } = useTranslation();

    const ContainerWidth = useBreakpointValue({
        base: '100%',
        lg: sizes['containerWidth'],
    });

    const ContentContainerWidth = useBreakpointValue({
        base: '100%',
        lg: sizes['contentContainerWidth'],
    });

    const subcourseQuery = gql(`
        query Subcourses($search: String!, $courseState: String!) {
            subcourseSearch(
                take: 50,
                search: $search
                courseStates: [$courseState],
                orderBy: "last-update",
            ) {
            id
            published
            course {
                name
                courseState
                tags {
                name
                }
                image
                category
            }
            minGrade
            maxGrade
            maxParticipants
            participantsCount
            firstLecture {
                start
            }
            instructors {
                firstname
                lastname
            }
            }
        }  
    `);

    const {
        data: drafts,
        loading: loadingDrafts,
        refetch: refetchDrafts,
    } = useQuery(subcourseQuery, {
        variables: {
            search: '',
            courseState: Course_Coursestate_Enum.Created,
        },
    });

    const {
        data: allowed,
        loading: loadingAllowed,
        refetch: refetchAllowed,
    } = useQuery(subcourseQuery, {
        variables: {
            search: '',
            courseState: Course_Coursestate_Enum.Allowed,
        },
    });

    const {
        data: submitted,
        loading: loadingSubmitted,
        refetch: refetchSubmitted,
    } = useQuery(subcourseQuery, {
        variables: {
            search: '',
            courseState: Course_Coursestate_Enum.Submitted,
        },
    });

    const {
        data: denied,
        loading: loadingDenied,
        refetch: refetchDenied,
    } = useQuery(subcourseQuery, {
        variables: {
            search: '',
            courseState: Course_Coursestate_Enum.Denied,
        },
    });

    const {
        data: cancelled,
        loading: loadingCancelled,
        refetch: refetchCancelled,
    } = useQuery(subcourseQuery, {
        variables: {
            search: '',
            courseState: Course_Coursestate_Enum.Cancelled,
        },
    });

    const loading = loadingAllowed || loadingSubmitted || loadingCancelled || loadingDenied || loadingDrafts;

    const search = useCallback(
        async (search: string) => {
            refetchAllowed({ search });
            refetchSubmitted({ search });
            refetchCancelled({ search });
            refetchDenied({ search });
            refetchDrafts({ search });
        },
        [refetchAllowed, refetchCancelled, refetchSubmitted, refetchDenied, refetchDrafts]
    );

    return (
        <AsNavigationItem path="group">
            <WithNavigation>
                {loading && <CenterLoadingSpinner />}
                {!loading && (
                    <VStack paddingX={space['1']} marginBottom={space['1']} marginX="auto" width="100%" maxWidth={ContainerWidth}>
                        <VStack space={space['0.5']} maxWidth={ContentContainerWidth}>
                            <Heading>{t('screening.courses.header')}</Heading>
                            <br />
                        </VStack>

                        <VStack maxWidth={ContentContainerWidth} marginBottom={space['1']}>
                            <SearchBar autoSubmit onSearch={search} />
                        </VStack>

                        <NavigationTabs
                            tabs={[
                                {
                                    title: t('screening.courses.submitted'),
                                    content: (
                                        <Subcourses courseGroups={[submitted?.subcourseSearch as Subcourse[]]} titles={[t('screening.courses.submitted')]} />
                                    ),
                                },
                                {
                                    title: t('screening.courses.allowed'),
                                    content: <Subcourses courseGroups={[allowed?.subcourseSearch as Subcourse[]]} titles={[t('screening.courses.allowed')]} />,
                                },
                                {
                                    title: t('screening.courses.drafts'),
                                    content: <Subcourses courseGroups={[drafts?.subcourseSearch as Subcourse[]]} titles={[t('screening.courses.drafts')]} />,
                                },
                                {
                                    title: t('screening.courses.cancelled'),
                                    content: (
                                        <Subcourses courseGroups={[cancelled?.subcourseSearch as Subcourse[]]} titles={[t('screening.courses.cancelled')]} />
                                    ),
                                },
                                {
                                    title: t('screening.courses.denied'),
                                    content: <Subcourses courseGroups={[denied?.subcourseSearch as Subcourse[]]} titles={[t('screening.courses.denied')]} />,
                                },
                            ]}
                        />
                    </VStack>
                )}
            </WithNavigation>
        </AsNavigationItem>
    );
};

export default ScreenerGroup;
