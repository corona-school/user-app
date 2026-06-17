import AchievementProgress from '../widgets/AchievementProgress';
import WithNavigation from '../components/WithNavigation';
import AsNavigationItem from '../components/AsNavigationItem';
import { Box, Stack, useBreakpointValue } from 'native-base';
import { useQuery } from '@apollo/client';
import { gql } from '../gql';
import CenterLoadingSpinner from '../components/CenterLoadingSpinner';
import SwitchLanguageButton from '../components/SwitchLanguageButton';
import NotificationAlert from '../components/notifications/NotificationAlert';
import { Achievement } from '../gql/graphql';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Typography } from '@/components/Typography';
import { useUserType } from '@/hooks/useApollo';
import { TutorStats, PupilStats } from '@/widgets/ProgressStats';

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
    const userType = useUserType();
    if (loading || inactiveLoading) return <CenterLoadingSpinner />;
    const achievements: Achievement[] = data?.me.achievements ? data?.me.achievements : [];
    const foundFurtherAchievements: Achievement[] = inactiveData?.me.furtherAchievements ? inactiveData?.me.furtherAchievements : [];
    return (
        <AsNavigationItem
            path="/progress"
            children={
                <WithNavigation
                    previousFallbackRoute="/settings"
                    headerTitle="Progress"
                    headerLeft={
                        <Stack alignItems="center" direction="row">
                            <SwitchLanguageButton />
                            <NotificationAlert />
                        </Stack>
                    }
                >
                    <Box mx={margin}>
                        <Breadcrumb />
                        <Typography variant="h2" className="font-bold mt-2 mb-6">
                            Erfolge & Statistiken
                        </Typography>

                        {/* Statistiken */}
                        <div className="mb-10">
                            <Typography variant="h5" className="font-semibold mb-4 text-gray-700">
                                Statistiken
                            </Typography>
                            {userType === 'student' ? <TutorStats /> : <PupilStats />}
                        </div>

                        {/* Achievements */}
                        <div>
                            <Typography variant="h4" className="font-bold mb-1">
                                Deine Erfolge
                            </Typography>
                            <Typography variant="h5" className="font-semibold mb-4 text-gray-600">
                                Rekorde
                            </Typography>
                            <AchievementProgress hideHeader achievements={achievements} inactiveAchievements={foundFurtherAchievements} />
                        </div>
                    </Box>
                </WithNavigation>
            }
        />
    );
};

export default Progress;
