import { useTranslation } from 'react-i18next';
import AsNavigationItem from '../../components/AsNavigationItem';
import WithNavigation from '../../components/WithNavigation';
import { Heading, VStack, useBreakpointValue, useTheme } from 'native-base';
import NavigationTabs from '../../components/NavigationTabs';
import SearchBar from '../../components/SearchBar';
import { useQuery } from '@apollo/client';
import { gql } from '../../gql';
import Subcourses from './Subcourses';
import { useCallback, useMemo } from 'react';
import { Course_Coursestate_Enum, Subcourse } from '../../gql/graphql';
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner';

const ScreenerGroup: React.FC = () => {
    const {
        data,
        loading,
        refetch: refetchCourses,
    } = useQuery(
        gql(`
            query Subcourses($search: String!) {
                subcourseSearch(
                    take: 40,
                    search: $search
                    courseStates: ["allowed", "denied", "submitted", "cancelled"]
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
                }
            }  
        `),
        { variables: { search: '' } }
    );

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

    const submitted = useMemo(
        () => data?.subcourseSearch.filter((subcourse) => subcourse.course.courseState === Course_Coursestate_Enum.Submitted),
        [data?.subcourseSearch]
    );

    const allowed = useMemo(
        () => data?.subcourseSearch.filter((subcourse) => subcourse.course.courseState === Course_Coursestate_Enum.Allowed),
        [data?.subcourseSearch]
    );

    const denied = useMemo(
        () => data?.subcourseSearch.filter((subcourse) => subcourse.course.courseState === Course_Coursestate_Enum.Denied),
        [data?.subcourseSearch]
    );

    const cancelled = useMemo(
        () => data?.subcourseSearch.filter((subcourse) => subcourse.course.courseState === Course_Coursestate_Enum.Cancelled),
        [data?.subcourseSearch]
    );

    const search = useCallback(
        async (search: string) => {
            refetchCourses({ search });
        },
        [refetchCourses]
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
                                    title: t('screening.courses.submitted_or_allowed'),
                                    content: (
                                        <Subcourses
                                            courseGroups={[submitted as Subcourse[], allowed as Subcourse[]]}
                                            titles={[t('screening.courses.submitted'), t('screening.courses.allowed')]}
                                        />
                                    ),
                                },
                                {
                                    title: t('screening.courses.denied_or_cancelled'),
                                    content: (
                                        <Subcourses
                                            courseGroups={[denied as Subcourse[], cancelled as Subcourse[]]}
                                            titles={[t('screening.courses.denied'), t('screening.courses.cancelled')]}
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

export default ScreenerGroup;
