import AchievementProgress from '../widgets/AchievementProgress';
import WithNavigation from '../components/WithNavigation';
import AsNavigationItem from '../components/AsNavigationItem';
import { Box, Stack, useBreakpointValue } from 'native-base';
import { useQuery } from '@apollo/client';
import { gql } from '../gql';
import CenterLoadingSpinner from '../components/CenterLoadingSpinner';
import LangNavigation from '../components/LangNavigation';
import NotificationAlert from '../components/notifications/NotificationAlert';
import { Achievement } from '../gql/graphql';

const achievementsQuery = gql(`
    query achievements {
        me {
            achievements {
                id
                name
                title
                tagline
                subtitle
                description
                footer
                image
                alternativeText
                achievementType
                achievementState
                steps {
                    name
                    isActive
                }
                maxSteps
                currentStep
                isNewAchievement
                actionType
                actionName
                actionRedirectLink
            }
        }
    }
`);
const furtherAchievementsQuery = gql(`
    query furtherAchievements {
        me {
            furtherAchievements {
                id
                name
                title
                tagline
                subtitle
                description
                footer
                image
                alternativeText
                achievementType
                achievementState
                steps {
                    name
                    isActive
                }
                maxSteps
                currentStep
                isNewAchievement
                actionType
                actionName
                actionRedirectLink
            }
        }
    }
`);

const Progress = () => {
    const margin = useBreakpointValue({ base: '4', md: '0' });
    const { data, loading } = useQuery(achievementsQuery);
    const { data: inactiveData, loading: inactiveLoading } = useQuery(furtherAchievementsQuery);
    if (loading || inactiveLoading) return <CenterLoadingSpinner />;
    const achievements: Achievement[] = data?.me.achievements ? data?.me.achievements : [];
    const foundFurtherAchievements: Achievement[] = inactiveData?.me.furtherAchievements ? inactiveData?.me.furtherAchievements : [];
    return (
        <AsNavigationItem
            path="/progress"
            children={
                <WithNavigation
                    showBack
                    previousFallbackRoute="/settings"
                    headerTitle="Progress"
                    headerLeft={
                        <Stack alignItems="center" direction="row">
                            <LangNavigation />
                            <NotificationAlert />
                        </Stack>
                    }
                >
                    <Box mx={margin}>
                        <AchievementProgress achievements={achievements} inactiveAchievements={foundFurtherAchievements} />
                    </Box>
                </WithNavigation>
            }
        />
    );
};

export default Progress;
