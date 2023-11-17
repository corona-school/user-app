import AchievementProgress from '../widgets/AchievementProgress';
import WithNavigation from '../components/WithNavigation';
import AsNavigationItem from '../components/AsNavigationItem';
import { Box } from 'native-base';
import { useQuery } from '@apollo/client';
import { gql } from '../gql';
import { Achievement, AchievementState, AchievementType, ActionTypes, Step } from '../types/achievement';
import { checkAndGetSecondEnumValue } from '../helper/achievement-helper';

const achievements = gql(`
    query achievements {
        me {
            achievements {
                name
                subtitle
                description
                image
                alternativeText
                actionType
                achievementType
                achievementState
                steps {
                    description
                    isActive
                }
                maxSteps
                currentStep
                newAchievement
                progressDescription
                actionName
                actionRedirectLink
            }
        }
    }
`);

const Progress = () => {
    const { data, error, loading } = useQuery(achievements);
    if (loading || error || !data) return <p>Loading...</p>;
    const foundAchievements: Achievement[] = data.me.achievements.map((achievement) => {
        const actionType: keyof typeof ActionTypes | null = checkAndGetSecondEnumValue(achievement.actionType, ActionTypes);
        const achievementType: keyof typeof AchievementType | null = checkAndGetSecondEnumValue(achievement.achievementType, AchievementType);
        const achievementState: keyof typeof AchievementState | null = checkAndGetSecondEnumValue(achievement.achievementState, AchievementState);
        if (!achievementType || !achievementState) throw new Error(`Error while trying to get the second enum value of ${achievement.achievementType}`);
        const steps = achievement.steps?.map((step) => {
            const element: Step = {
                description: step.description,
                isActive: step.isActive ? true : false,
            };
            return element;
        });
        const element: Achievement = {
            name: achievement.name,
            subtitle: achievement.subtitle,
            description: achievement.description,
            image: achievement.image,
            alternativeText: achievement.alternativeText,
            actionType: actionType ? ActionTypes[actionType] : undefined,
            achievementType: AchievementType[achievementType],
            achievementState: AchievementState[achievementState],
            steps: steps,
            maxSteps: achievement.maxSteps,
            currentStep: achievement.currentStep,
            newAchievement: achievement.newAchievement ? true : false,
            progressDescription: achievement.progressDescription ? achievement.progressDescription : undefined,
            actionName: achievement.actionName ? achievement.actionName : undefined,
            actionRedirectLink: achievement.actionRedirectLink ? achievement.actionRedirectLink : undefined,
        };
        return element;
    });
    console.log(foundAchievements);
    return (
        <AsNavigationItem
            path="/progress"
            children={
                <WithNavigation showBack headerTitle="Progress">
                    <Box mx="4">
                        <AchievementProgress achievements={foundAchievements} />
                    </Box>
                </WithNavigation>
            }
        />
    );
};

export default Progress;
