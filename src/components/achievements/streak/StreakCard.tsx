import { HStack, VStack, Text, useBreakpointValue, Box, Pressable } from 'native-base';
import AchievementImageContainer from '../AchievementImageContainer';
import { ShineSize } from '../../../types/achievement';
import { Achievement_Action_Type_Enum, Achievement_Type_Enum } from '../../../gql/graphql';
import { useTranslation, Trans } from 'react-i18next';
import CardProgressDescription from '../achievementCard/CardProgressDescription';
import IndicatorBar from '../progressIndicators/IndicatorBar';
import NewAchievementShine from '../cosmetics/NewAchievementShine';

type StreakCardProps = {
    streak: number;
    record?: number;
    title: string;
    progressDescription: string;
    image: string;
    alternativeText: string;
    actionType?: Achievement_Action_Type_Enum | null;
    onClick: () => void;
};

const StreakCard: React.FC<StreakCardProps> = ({ streak, record, title, progressDescription, image, alternativeText, actionType, onClick }) => {
    const { t } = useTranslation();
    const width = useBreakpointValue({ base: '100%', md: '350px' });
    const maxTextWidth = useBreakpointValue({ base: 'calc(100% - 90px - 16px)', md: '215px' });
    return (
        <Pressable onPress={onClick}>
            <HStack backgroundColor="primary.900" width={width} height="128px" padding="16px" alignItems="center" borderRadius={8} space={2}>
                <VStack alignItems="center" width="90px" justifyContent="center">
                    {(!record || streak === record) && (
                        <VStack zIndex={1} position="absolute" width="90px" height="80px" alignItems="center" justifyContent="center" alignSelf="center">
                            <NewAchievementShine size={ShineSize.XSMALL} />
                        </VStack>
                    )}
                    <AchievementImageContainer
                        image={image}
                        alternativeText={alternativeText}
                        achievementType={Achievement_Type_Enum.Streak}
                        streak={streak}
                        isRecord={!record || streak === record}
                    />
                </VStack>
                <VStack maxWidth={maxTextWidth} height="100%" justifyContent="flex-start" space="6px">
                    <Text width="100%" color="white" noOfLines={1} bold>
                        {title}
                    </Text>
                    <Text color="white" fontSize="xs" noOfLines={2}>
                        <Trans>{t('achievement.streak.card.info', { streak: record })}</Trans>
                    </Text>
                    {record && (
                        <Box>
                            {streak === record ? (
                                <CardProgressDescription
                                    actionType={actionType}
                                    achievementType={Achievement_Type_Enum.Streak}
                                    progressDescription={progressDescription}
                                    isColorized
                                />
                            ) : (
                                <IndicatorBar maxSteps={record} currentStep={streak} achievementType={Achievement_Type_Enum.Streak} fullWidth isCard />
                            )}
                        </Box>
                    )}
                </VStack>
            </HStack>
        </Pressable>
    );
};

export default StreakCard;
