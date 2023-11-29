import { Box, Divider, HStack, Stack, VStack, useBreakpointValue } from 'native-base';
import { Achievement, AchievementState, AchievementType } from '../types/achievement';
import AchievementCard from '../components/achievements/achievementCard/AchievementCard';
import StreakCard from '../components/achievements/streak/StreakCard';
import ProgressCollapsableHeadline from '../components/achievements/ProgressCollapsableHeadline';
import { useEffect, useMemo, useState } from 'react';
import AchievementModal from '../components/achievements/modals/AchievementModal';

type AchievementProgressProps = {
    achievements: Achievement[];
};

const AchievementProgress: React.FC<AchievementProgressProps> = ({ achievements }) => {
    // Sort Example Data: Will be removed when the API data is implemented
    const streaks: Achievement[] = useMemo(() => {
        const allStreaks: Achievement[] = [];
        achievements.forEach((achievement) => {
            if (achievement.achievementType === AchievementType.STREAK) {
                allStreaks.push(achievement);
            }
        });
        return allStreaks;
    }, [achievements]);
    const sortedAchievements: { [key in AchievementState]: Achievement[] } = useMemo(() => {
        const elements: { [key in AchievementState]: Achievement[] } = {
            [AchievementState.COMPLETED]: [],
            [AchievementState.ACTIVE]: [],
            [AchievementState.INACTIVE]: [],
        };
        achievements.forEach((achievement) => {
            if (achievement.achievementType !== AchievementType.STREAK) {
                elements[achievement.achievementState].push(achievement);
            }
        });
        return elements;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [achievements]);
    const keys = Object.keys(sortedAchievements);
    const states = keys.map((key) => AchievementState[key as keyof typeof AchievementState]);
    // ------ End of Example Data ------

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

    const mobile = useBreakpointValue({ base: true, md: false });
    useEffect(() => {
        if (!mobile) {
            setCollapsed({
                ...collapsed,
                [AchievementType.STREAK]: false,
                [AchievementState.ACTIVE]: false,
                [AchievementState.COMPLETED]: false,
                [AchievementState.INACTIVE]: false,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mobile]);
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
    const spaceAfterHeadline = useBreakpointValue({ base: 3, md: 1 });

    const handleOnClick = (type?: AchievementType, state?: AchievementState) => {
        if (type && type === AchievementType.STREAK) {
            setCollapsed({ ...collapsed, [type]: !collapsed[type] });
        } else if (state) {
            setCollapsed({ ...collapsed, [state]: !collapsed[state] });
        }
    };
    return (
        <Box>
            {selectedAchievement && (
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
                    progressDescription={selectedAchievement.progressDescription}
                    image={selectedAchievement.image}
                    alternativeText={selectedAchievement.alternativeText}
                    buttonText={selectedAchievement.actionName}
                    onClose={() => setOpenModal(false)}
                    showModal={openModal}
                />
            )}
            <VStack space={spaceAfterHeadline}>
                <ProgressCollapsableHeadline achievementType={AchievementType.STREAK} onClick={() => handleOnClick(AchievementType.STREAK, undefined)} />
                <Stack
                    direction={stackDirection}
                    space={cardSpace}
                    overflowX={streakContainerOverflow}
                    backgroundColor={cardContainerBg}
                    borderRadius="8px"
                    height={collapsed[AchievementType.STREAK] ? '0' : 'fit-content'}
                    overflowY="hidden"
                >
                    {streaks.map((achievement) => (
                        <Stack key={achievement.name} marginTop={cardMargin}>
                            <StreakCard
                                streak={achievement.currentStep}
                                title={achievement.name}
                                progressDescription={achievement.description}
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
                    <VStack key={key} space={3} marginTop={10}>
                        <ProgressCollapsableHeadline achievementState={key} onClick={() => handleOnClick(undefined, key)} />
                        <HStack
                            width="100%"
                            flexWrap="wrap"
                            backgroundColor={key === AchievementState.COMPLETED && cardContainerBg}
                            borderRadius="8px"
                            height={collapsed[key] ? '0' : 'fit-content'}
                            overflowY={collapsed[key] ? 'hidden' : 'unset'}
                        >
                            {sortedAchievements[key].map((achievement) => (
                                <Box key={achievement.name} marginTop={cardMargin} width={achievementContainerWidth} overflow="visible" marginRight={cardSpace}>
                                    <AchievementCard
                                        achievementState={achievement.achievementState}
                                        achievementType={achievement.achievementType}
                                        actionType={achievement.actionType}
                                        image={achievement.image}
                                        alternativeText={''}
                                        subtitle={achievement.subtitle}
                                        title={achievement.name}
                                        progressDescription={achievement.steps ? achievement.steps[achievement.currentStep - 1]?.description : undefined}
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

export default AchievementProgress;
