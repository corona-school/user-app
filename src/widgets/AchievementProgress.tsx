import { Box, Divider, HStack, Stack, VStack, useBreakpointValue } from 'native-base';
import { Achievement } from '../types/achievement';
import AchievementCard from '../components/achievements/achievementCard/AchievementCard';
import StreakCard from '../components/achievements/streak/StreakCard';
import ProgressCollapsableHeadline from '../components/achievements/ProgressCollapsableHeadline';
import { useEffect, useMemo, useState } from 'react';
import AchievementModal from '../components/achievements/modals/AchievementModal';
import { useMutation } from '@apollo/client';
import { gql } from '../gql';
import { Achievement_State, Achievement_Type_Enum } from '../gql/graphql';
import { customSort } from '../helper/achievement-helper';

type AchievementProgressProps = {
    achievements: Achievement[];
    inactiveAchievements: Achievement[];
};

const AchievementProgress: React.FC<AchievementProgressProps> = ({ achievements, inactiveAchievements }) => {
    const [isSeen] = useMutation(
        gql(`
        mutation markAchievementAsSeen($id: Float!) {
            markAchievementAsSeen(achievementId: $id)
        }
    `)
    );

    const streaks: Achievement[] = useMemo(() => {
        const allStreaks: Achievement[] = [];
        achievements.forEach((achievement) => {
            if (achievement.achievementType === Achievement_Type_Enum.Streak) {
                allStreaks.push(achievement);
            }
        });
        return allStreaks;
    }, [achievements]);

    const sortedAchievements: { [key in Achievement_State]: Achievement[] } = useMemo(() => {
        const elements: { [key in Achievement_State]: Achievement[] } = {
            [Achievement_State.Completed]: [],
            [Achievement_State.Active]: [],
            [Achievement_State.Inactive]: [],
        };
        achievements.forEach((achievement) => {
            if (achievement.achievementType !== Achievement_Type_Enum.Streak) {
                elements[achievement.achievementState].push(achievement);
            }
        });
        inactiveAchievements.forEach((achievement) => {
            if (achievement.achievementType !== Achievement_Type_Enum.Streak) {
                elements[achievement.achievementState].push(achievement);
            }
        });
        return elements;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [achievements]);
    const states = Object.keys(Achievement_State)
        .map((key) => {
            return Achievement_State[key as keyof typeof Achievement_State];
        })
        .sort(customSort);

    const [collapsed, setCollapsed] = useState({
        [Achievement_Type_Enum.Streak]: false,
        [Achievement_State.Completed]: false,
        [Achievement_State.Active]: false,
        [Achievement_State.Inactive]: false,
    });
    const [selectedAchievement, setSelectedAchievement] = useState<Achievement>(achievements[0]);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const isNewAchievement = useMemo(() => {
        if (selectedAchievement === undefined || !openModal) {
            return false;
        } else if (selectedAchievement.achievementType === Achievement_Type_Enum.Streak) {
            if (selectedAchievement.currentStep === selectedAchievement.maxSteps) {
                return true;
            }
            return false;
        }
        return selectedAchievement.isNewAchievement;
    }, [selectedAchievement, openModal]);

    const mobile = useBreakpointValue({ base: true, md: false });
    useEffect(() => {
        if (!mobile) {
            setCollapsed({
                ...collapsed,
                [Achievement_Type_Enum.Streak]: false,
                [Achievement_State.Active]: false,
                [Achievement_State.Completed]: false,
                [Achievement_State.Inactive]: false,
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
    const streaksContainerWidth = useBreakpointValue({
        base: 'auto',
        md: 'calc(100% + 16px)',
    });
    const streaksContainerPaddingRight = useBreakpointValue({
        base: '0',
        md: '16px',
    });

    const handleOnClick = (type?: Achievement_Type_Enum, state?: Achievement_State) => {
        if (type && type === Achievement_Type_Enum.Streak) {
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
                    isNewAchievement={isNewAchievement}
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
                <ProgressCollapsableHeadline
                    achievementType={Achievement_Type_Enum.Streak}
                    onClick={() => handleOnClick(Achievement_Type_Enum.Streak, undefined)}
                />
                <Stack
                    direction={stackDirection}
                    space={cardSpace}
                    overflowX={streakContainerOverflow}
                    backgroundColor={cardContainerBg}
                    borderRadius="8px"
                    width={streaksContainerWidth}
                    height={collapsed[Achievement_Type_Enum.Streak] ? '0' : 'fit-content'}
                    overflowY="hidden"
                    paddingRight={streaksContainerPaddingRight}
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
                                    if (achievement.isNewAchievement) isSeen({ variables: { id: achievement.id } });
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
                            backgroundColor={key === Achievement_State.Completed && cardContainerBg}
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
                                        progressDescription={achievement.steps ? achievement.steps[achievement.currentStep]?.name : undefined}
                                        maxSteps={achievement.maxSteps}
                                        currentStep={achievement.currentStep}
                                        isNewAchievement={achievement.isNewAchievement}
                                        onClick={() => {
                                            setSelectedAchievement(achievement);
                                            if (achievement.isNewAchievement) isSeen({ variables: { id: achievement.id } });
                                            setOpenModal(true);
                                        }}
                                    />
                                    {showDivider && (
                                        <Divider
                                            bg={key === Achievement_State.Completed ? 'primary.500' : 'gray.300'}
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
