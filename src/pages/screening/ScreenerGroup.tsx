import { useTranslation } from 'react-i18next';
import AsNavigationItem from '../../components/AsNavigationItem';
import WithNavigation from '../../components/WithNavigation';
import { Heading, VStack, useBreakpointValue, useTheme } from 'native-base';
import SearchBar from '../../components/SearchBar';
import { useQuery } from '@apollo/client';
import { gql } from '../../gql';
import Subcourses from './Subcourses';
import { useCallback, useState } from 'react';
import { Course_Coursestate_Enum, Subcourse } from '../../gql/graphql';
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner';
import { Tabs, TabsList, TabsTrigger } from '@/components/Panels';

const ScreenerGroup: React.FC = () => {
    const { space, sizes } = useTheme();
    const { t } = useTranslation();
    const [courseState, setCourseState] = useState<Course_Coursestate_Enum>(Course_Coursestate_Enum.Submitted);

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
                take: 100,
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
                image {
                    url
                    default
                }
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
        data: subcourses,
        loading,
        refetch: refetchSubcourses,
    } = useQuery(subcourseQuery, {
        variables: {
            search: '',
            courseState,
        },
    });

    const search = useCallback(
        async (search: string) => {
            refetchSubcourses({ search });
        },
        [refetchSubcourses]
    );

    return (
        <AsNavigationItem path="group">
            <WithNavigation>
                <VStack paddingX={space['1']} marginBottom={space['1']} marginX="auto" width="100%" maxWidth={ContainerWidth}>
                    <VStack space={space['0.5']} maxWidth={ContentContainerWidth}>
                        <Heading>{t('screening.courses.header')}</Heading>
                        <br />
                    </VStack>

                    <VStack maxWidth={ContentContainerWidth} marginBottom={space['1']}>
                        <SearchBar autoSubmit onSearch={search} isLoading={loading} />
                    </VStack>
                    <Tabs value={courseState} onValueChange={(value) => setCourseState(value as Course_Coursestate_Enum)}>
                        <TabsList>
                            <TabsTrigger value={Course_Coursestate_Enum.Submitted}>{t('screening.courses.submitted')}</TabsTrigger>
                            <TabsTrigger value={Course_Coursestate_Enum.Allowed}>{t('screening.courses.allowed')}</TabsTrigger>
                            <TabsTrigger value={Course_Coursestate_Enum.Created}>{t('screening.courses.drafts')}</TabsTrigger>
                            <TabsTrigger value={Course_Coursestate_Enum.Cancelled}>{t('screening.courses.cancelled')}</TabsTrigger>
                            <TabsTrigger value={Course_Coursestate_Enum.Denied}>{t('screening.courses.denied')}</TabsTrigger>
                        </TabsList>
                        {loading ? (
                            <CenterLoadingSpinner />
                        ) : (
                            <div className="mt-8 max-h-full overflow-y-scroll">
                                <Subcourses courseGroups={[subcourses?.subcourseSearch as Subcourse[]]} titles={[]} />
                            </div>
                        )}
                    </Tabs>
                </VStack>
            </WithNavigation>
        </AsNavigationItem>
    );
};

export default ScreenerGroup;
