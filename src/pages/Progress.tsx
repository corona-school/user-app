import { Box, HStack, Text, VStack } from 'native-base';
import { Achievement, AchievementState, AchievementType } from '../components/achievements/types';
import AchievementCard from '../components/achievements/achievementCard/AchievementCard';
import KanufahrtDschungel from '../assets/images/achievements/KanufahrtDschungel.png';
import { useTranslation } from 'react-i18next';
import StreakCard from '../components/achievements/streak/StreakCard';

type ProgressProps = {
    achievements: Achievement[];
};

const Progress: React.FC<ProgressProps> = ({ achievements }) => {
    const { t } = useTranslation();
    const sortedAchievements: { [key in AchievementState]: Achievement[] } = {
        [AchievementState.COMPLETED]: [],
        [AchievementState.ACTIVE]: [],
        [AchievementState.INACTIVE]: [],
    };
    const streaks: Achievement[] = [];
    const keys = Object.keys(sortedAchievements);
    const states = keys.map((key) => AchievementState[key as keyof typeof AchievementState]);

    achievements.forEach((achievement) => {
        if (achievement.achievementType === AchievementType.STREAK) {
            streaks.push(achievement);
            return;
        }
        sortedAchievements[achievement.achievementState].push(achievement);
    });
    return (
        <VStack>
            <Text fontSize="2xl" fontWeight="bold">
                {t('achievement.progress.streak.headline')}
            </Text>
            <HStack space={5} overflowX="scroll" overflowY="hidden">
                {streaks.map((achievement) => (
                    <StreakCard
                        streak={achievement.currentStep}
                        title={achievement.name}
                        actionDescription={achievement.description}
                        image={achievement.image}
                        alternativeText={achievement.alternativeText}
                        actionType={achievement.actionType}
                        record={achievement.maxSteps}
                    />
                ))}
            </HStack>
            {states.map((key) => (
                <VStack space={8}>
                    <Text fontSize="md" fontWeight="bold">
                        {key === AchievementState.COMPLETED && `${t('achievement.progress.state.completed')}`}
                        {key === AchievementState.ACTIVE && `${t('achievement.progress.state.active')}`}
                        {key === AchievementState.INACTIVE && `${t('achievement.progress.state.inactive')}`}
                    </Text>
                    <HStack overflow="hidden" flexWrap="wrap" space={5} paddingTop={key === AchievementState.COMPLETED ? 4 : 0}>
                        {sortedAchievements[key].map((achievement) => (
                            <Box marginBottom={10}>
                                <AchievementCard
                                    achievementState={achievement.achievementState}
                                    achievementType={achievement.achievementType}
                                    actionType={achievement.actionType}
                                    image={KanufahrtDschungel}
                                    alternativeText={''}
                                    subtitle={achievement.subtitle}
                                    title={achievement.name}
                                    actionDescription={achievement.description}
                                    maxSteps={achievement.maxSteps}
                                    currentStep={achievement.currentStep}
                                    newAchievement={achievement.newAchievement}
                                />
                            </Box>
                        ))}
                    </HStack>
                </VStack>
            ))}
        </VStack>
    );
};

export default Progress;
