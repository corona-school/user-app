import AchievementProgress from '../widgets/AchievementProgress';
import WithNavigation from '../components/WithNavigation';
import AsNavigationItem from '../components/AsNavigationItem';
import { Box, useBreakpointValue } from 'native-base';
import { useQuery } from '@apollo/client';
import { gql } from '../gql';
import { Achievement } from '../types/achievement';
import { TypeofAchievementQuery, convertDataToAchievement } from '../helper/achievement-helper';
import CenterLoadingSpinner from '../components/CenterLoadingSpinner';

const achievementsQuery = gql(`
    query achievements {
        me {
            achievements {
                id
                name
                subtitle
                description
                image
                alternativeText
                actionType
                achievementType
                achievementState
                steps {
                    name
                    isActive
                }
                maxSteps
                currentStep
                isNewAchievement
                progressDescription
                actionName
                actionRedirectLink
            }
        }
    }
`);
const inactiveAchievementsQuery = gql(`
    query inactiveAchievements {
        me {
            inactiveAchievements {
                id
                name
                subtitle
                description
                image
                alternativeText
                actionType
                achievementType
                achievementState
                steps {
                    name
                    isActive
                }
                maxSteps
                currentStep
                isNewAchievement
                progressDescription
                actionName
                actionRedirectLink
            }
        }
    }
`);

const Progress = () => {
    const margin = useBreakpointValue({ base: '4', md: '0' });
    const { data, error, loading } = useQuery(achievementsQuery);
    const { data: inactiveData, error: inactiveError, loading: inactiveLoading } = useQuery(inactiveAchievementsQuery);
    if (loading || inactiveLoading || error || inactiveError || !data || !inactiveData) return <CenterLoadingSpinner />;
    const foundAchievements: Achievement[] = convertDataToAchievement({ data, type: TypeofAchievementQuery.achievements });
    const foundInactiveAchievements: Achievement[] = convertDataToAchievement({ data: inactiveData, type: TypeofAchievementQuery.inactiveAchievements });
    return (
        <AsNavigationItem
            path="/progress"
            children={
                <WithNavigation showBack headerTitle="Progress">
                    <Box mx={margin}>
                        <AchievementProgress achievements={foundAchievements} inactiveAchievements={foundInactiveAchievements} />
                    </Box>
                </WithNavigation>
            }
        />
    );
};

export default Progress;
