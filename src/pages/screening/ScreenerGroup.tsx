import { useTranslation } from 'react-i18next';
import AsNavigationItem from '../../components/AsNavigationItem';
import WithNavigation from '../../components/WithNavigation';
import { Heading, VStack, useBreakpointValue, useTheme } from 'native-base';
import NavigationTabs from '../../components/NavigationTabs';
import SearchBar from '../../components/SearchBar';
import { useQuery } from '@apollo/client';
import { gql } from '../../gql';
import Subcourses from './Subcourses';
import { useMemo } from 'react';
import { Course_Coursestate_Enum, Subcourse } from '../../gql/graphql';

const ScreenerGroup: React.FC = () => {
    /* courses with courseState "created" aren't yet approved for a screening 
    by the course creator, so we only want to show the other courses here */
    const { data, loading } = useQuery(
        gql(`
            query courses {
                subcoursesPublic(
                    take: 20
                    # where: { course: { isNot: { courseState: { equals: created } } } }
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
        `)
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

    const submittedOrAllowed = useMemo(
        () =>
            data?.subcoursesPublic.filter(
                (subcourse) =>
                    subcourse.course.courseState === Course_Coursestate_Enum.Submitted || subcourse.course.courseState === Course_Coursestate_Enum.Allowed
            ),
        [data?.subcoursesPublic]
    );

    const DeniedOrCancelled = useMemo(
        () =>
            data?.subcoursesPublic.filter(
                (subcourse) =>
                    subcourse.course.courseState === Course_Coursestate_Enum.Denied || subcourse.course.courseState === Course_Coursestate_Enum.Cancelled
            ),
        [data?.subcoursesPublic]
    );

    const all = data?.subcoursesPublic;

    /* TEMPORARY REMOVE LATER */
    const search = (s: string) => console.log(s);

    const groups = new Array<Subcourse[]>();
    groups.push(all as Subcourse[]);
    groups.push(all as Subcourse[]);

    return (
        <AsNavigationItem path="group">
            <WithNavigation>
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
                                title: t('screening.courses.submitted_or_approved'),
                                content: <Subcourses courseGroups={groups} titles={['Gruppe 1', 'Gruppe 2']} />,
                            },
                            {
                                title: t('screening.courses.denied_or_cancelled'),
                                content: <></>,
                            },
                        ]}
                    />
                </VStack>
            </WithNavigation>
        </AsNavigationItem>
    );
};

export default ScreenerGroup;
