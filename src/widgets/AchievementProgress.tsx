import { Box, Divider, HStack, Heading, Stack, VStack, useBreakpointValue } from 'native-base';
import AchievementCard from '../components/achievements/achievementCard/AchievementCard';
import StreakCard from '../components/achievements/streak/StreakCard';
import ProgressCollapsableHeadline from '../components/achievements/ProgressCollapsableHeadline';
import { useEffect, useMemo, useState } from 'react';
import AchievementModal from '../components/achievements/modals/AchievementModal';
import { useMutation } from '@apollo/client';
import { gql } from '../gql';
import { Achievement, Achievement_State, Achievement_Type_Enum } from '../gql/graphql';
import EmptyStateContainer from '../components/achievements/EmptyStateContainer';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();

    const streaks: Achievement[] = useMemo(() => {
        const allStreaks: Achievement[] = achievements.filter((it) => it.achievementType === Achievement_Type_Enum.Streak);

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
    const states = [Achievement_State.Active, Achievement_State.Completed, Achievement_State.Inactive];

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
            setCollapsed((prev) => ({
                ...prev,
                [Achievement_Type_Enum.Streak]: false,
                [Achievement_State.Active]: false,
                [Achievement_State.Completed]: false,
                [Achievement_State.Inactive]: false,
            }));
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

    const handleOnClick = (isStreak?: boolean, state?: Achievement_State) => {
        if (isStreak) {
            setCollapsed({ ...collapsed, [Achievement_Type_Enum.Streak]: !collapsed[Achievement_Type_Enum.Streak] });
        } else if (state) {
            setCollapsed({ ...collapsed, [state]: !collapsed[state] });
        }
    };

    return (
        <Box>
            <Heading paddingBottom="5">{t('achievement.header')}</Heading>
            {selectedAchievement && (
                <AchievementModal
                    title={selectedAchievement.subtitle || undefined}
                    name={selectedAchievement.name}
                    description={selectedAchievement.description}
                    achievementState={selectedAchievement.achievementState}
                    achievementType={selectedAchievement.achievementType}
                    isNewAchievement={isNewAchievement || undefined}
                    steps={selectedAchievement.steps || undefined}
                    maxSteps={selectedAchievement.maxSteps}
                    currentStep={selectedAchievement.currentStep}
                    progressDescription={selectedAchievement.progressDescription || undefined}
                    image={selectedAchievement.image}
                    achievedText={selectedAchievement.achievedText || undefined}
                    alternativeText={selectedAchievement.alternativeText}
                    buttonText={selectedAchievement.actionName || undefined}
                    buttonLink={selectedAchievement.actionRedirectLink || undefined}
                    onClose={() => setOpenModal(false)}
                    showModal={openModal}
                />
            )}
            <VStack space={spaceAfterHeadline}>
                {streaks.length > 0 && (
                    <VStack space={spaceAfterHeadline} marginBottom={10}>
                        <ProgressCollapsableHeadline achievementType={Achievement_Type_Enum.Streak} onClick={() => handleOnClick(true, undefined)} />
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
                                        record={achievement.maxSteps}
                                        title={achievement.name}
                                        streakProgress={achievement.streakProgress!}
                                        achievementState={achievement.achievementState}
                                        progressDescription={
                                            achievement.achievementState === Achievement_State.Completed
                                                ? achievement.achievedText!
                                                : achievement.progressDescription!
                                        }
                                        image={achievement.image}
                                        alternativeText={achievement.alternativeText}
                                        actionType={achievement.actionType}
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
                    </VStack>
                )}
                {states.map((key) => (
                    <Box>
                        {(sortedAchievements[key].length > 0 || key === Achievement_State.Completed) && (
                            <VStack key={key} space={3} marginBottom={10}>
                                <ProgressCollapsableHeadline achievementState={key} onClick={() => handleOnClick(undefined, key)} />
                                <Box>
                                    {sortedAchievements[key].length === 0 ? (
                                        <HStack
                                            width="100%"
                                            backgroundColor={key === Achievement_State.Completed && sortedAchievements[key].length > 0 && cardContainerBg}
                                            height={collapsed[key] ? '0' : 'fit-content'}
                                            overflowY={collapsed[key] ? 'hidden' : 'unset'}
                                        >
                                            <EmptyStateContainer achievementState={key} />
                                        </HStack>
                                    ) : (
                                        <HStack
                                            width="100%"
                                            flexWrap="wrap"
                                            backgroundColor={key === Achievement_State.Completed && sortedAchievements[key].length > 0 && cardContainerBg}
                                            borderRadius="8px"
                                            height={collapsed[key] ? '0' : 'fit-content'}
                                            overflowY={collapsed[key] ? 'hidden' : 'unset'}
                                        >
                                            {sortedAchievements[key].map((achievement) => (
                                                <Box marginTop={cardMargin} width={achievementContainerWidth} overflow="visible" marginRight={cardSpace}>
                                                    <AchievementCard
                                                        achievementState={achievement.achievementState}
                                                        achievementType={achievement.achievementType}
                                                        actionType={achievement.actionType}
                                                        image={achievement.image}
                                                        alternativeText={''}
                                                        subtitle={achievement.subtitle || undefined}
                                                        title={achievement.name}
                                                        progressDescription={achievement.actionName || ''}
                                                        maxSteps={achievement.maxSteps}
                                                        currentStep={achievement.currentStep}
                                                        isNewAchievement={achievement.isNewAchievement || undefined}
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
                                    )}
                                </Box>
                            </VStack>
                        )}
                    </Box>
                ))}
            </VStack>
        </Box>
    );
};

export default AchievementProgress;
