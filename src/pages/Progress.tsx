import { Box, Divider, HStack, Stack, VStack, useBreakpointValue } from 'native-base';
import { Achievement, AchievementState, AchievementType } from '../components/achievements/types';
import AchievementCard from '../components/achievements/achievementCard/AchievementCard';
import StreakCard from '../components/achievements/streak/StreakCard';
import ProgressCollapsableHeadline from '../components/achievements/ProgressCollapsableHeadline';
import { useMemo, useState } from 'react';
import AchievementModal from '../components/achievements/modals/AchievementModal';

type ProgressProps = {
    achievements: Achievement[];
};

const Progress: React.FC<ProgressProps> = ({ achievements }) => {
    // Sortieren von Beispiel Daten: Wird entfernt, wenn die Daten von der API kommen
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
    // ------ Ende der Beispieldaten ------

    const [collapsed, setCollapsed] = useState({
        [AchievementType.STREAK]: false,
        [AchievementState.COMPLETED]: false,
        [AchievementState.ACTIVE]: false,
        [AchievementState.INACTIVE]: false,
    });
    const [selectedAchievement, setSelectedAchievement] = useState<Achievement>(achievements[0]);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const isNewAchievement = useMemo(() => {
        if (selectedAchievement === undefined || !openModal) {
            return false;
        } else if (selectedAchievement.achievementType === AchievementType.STREAK) {
            if (selectedAchievement.currentStep === selectedAchievement.maxSteps) {
                return true;
            }
            return false;
        }
        return selectedAchievement.newAchievement;
    }, [selectedAchievement, openModal]);

    const cardMargin = useBreakpointValue({ base: 2, md: 5 });
    const cardContainerBg = useBreakpointValue({
        base: 'primary.800',
        md: 'transparent',
    });
    const stackDirection = useBreakpointValue({
        base: 'column',
        md: 'row',
    });
    const showDivider = useBreakpointValue({
        base: true,
        md: false,
    });
    const streakContainerOverflow = useBreakpointValue({
        base: 'unset',
        md: 'scroll',
    });
    const achievementContainerWidth = useBreakpointValue({
        base: '100%',
        md: 'fit-content',
    });
    const cardSpace = useBreakpointValue({ base: 0, md: 5 });

    const handleOnClick = (type?: AchievementType, state?: AchievementState) => {
        if (type && type === AchievementType.STREAK) {
            setCollapsed({ ...collapsed, [type]: !collapsed[type] });
        } else if (state) {
            setCollapsed({ ...collapsed, [state]: !collapsed[state] });
        }
    };
    return (
        <Box>
            <AchievementModal
                title={selectedAchievement.subtitle}
                name={selectedAchievement.name}
                description={selectedAchievement.description}
                achievementState={selectedAchievement.achievementState}
                achievementType={selectedAchievement.achievementType}
                newAchievement={isNewAchievement}
                steps={selectedAchievement.steps}
                maxSteps={selectedAchievement.maxSteps}
                currentStep={selectedAchievement.currentStep}
                actionDescription={selectedAchievement.actionDescription}
                achievedText={selectedAchievement.achievedText}
                image={selectedAchievement.image}
                alternativeText={selectedAchievement.alternativeText}
                buttonText={selectedAchievement.buttonLabel}
                onClose={() => setOpenModal(false)}
                showModal={openModal}
            />
            <VStack space={3}>
                <ProgressCollapsableHeadline achievementType={AchievementType.STREAK} onClick={() => handleOnClick(AchievementType.STREAK, undefined)} />
                <Stack
                    direction={stackDirection}
                    space={cardSpace}
                    overflowX={streakContainerOverflow}
                    backgroundColor={cardContainerBg}
                    borderRadius="8px"
                    height={collapsed[AchievementType.STREAK] ? '0' : 'fit-content'}
                    overflowY={collapsed[AchievementType.STREAK] ? 'hidden' : 'unset'}
                >
                    {streaks.map((achievement) => (
                        <Stack marginTop={cardMargin}>
                            <StreakCard
                                streak={achievement.currentStep}
                                title={achievement.name}
                                actionDescription={achievement.description}
                                image={achievement.image}
                                alternativeText={achievement.alternativeText}
                                actionType={achievement.actionType}
                                record={achievement.maxSteps}
                                onClick={() => {
                                    setSelectedAchievement(achievement);
                                    setOpenModal(true);
                                }}
                            />
                            {showDivider && <Divider marginTop={cardMargin} bg="primary.500" width="90%" left="5%" opacity={0.25} />}
                        </Stack>
                    ))}
                </Stack>
                {states.map((key) => (
                    <VStack space={3} marginTop={10}>
                        <ProgressCollapsableHeadline achievementState={key} onClick={() => handleOnClick(undefined, key)} />
                        <HStack
                            width="100%"
                            flexWrap="wrap"
                            space={cardSpace}
                            backgroundColor={key === AchievementState.COMPLETED && cardContainerBg}
                            borderRadius="8px"
                            height={collapsed[key] ? '0' : 'fit-content'}
                            overflowY={collapsed[key] ? 'hidden' : 'unset'}
                        >
                            {sortedAchievements[key].map((achievement, idx) => (
                                <Box marginTop={cardMargin} width={achievementContainerWidth} overflow="visible">
                                    <AchievementCard
                                        achievementState={achievement.achievementState}
                                        achievementType={achievement.achievementType}
                                        actionType={achievement.actionType}
                                        image={achievement.image}
                                        alternativeText={''}
                                        subtitle={achievement.subtitle}
                                        title={achievement.name}
                                        actionDescription={achievement.description}
                                        maxSteps={achievement.maxSteps}
                                        currentStep={achievement.currentStep}
                                        newAchievement={achievement.newAchievement}
                                        onClick={() => {
                                            setSelectedAchievement(achievement);
                                            setOpenModal(true);
                                        }}
                                    />
                                    {showDivider && (
                                        <Divider
                                            bg={key === AchievementState.COMPLETED ? 'primary.500' : 'gray.300'}
                                            width="90%"
                                            left="5%"
                                            opacity={0.25}
                                            marginTop={cardMargin}
                                        />
                                    )}
                                </Box>
                            ))}
                        </HStack>
                    </VStack>
                ))}
            </VStack>
        </Box>
    );
};

export default Progress;
