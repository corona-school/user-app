import { HStack, VStack, Text, PresenceTransition, useBreakpointValue } from 'native-base';
import AchievementImageContainer from '../AchievementImageContainer';
import { AchievementType, ActionTypes, ShineSize } from '../types';
import { useTranslation, Trans } from 'react-i18next';
import CardActionDescription from '../achievementCard/CardActionDescription';
import IndicatorBar from '../progressIndicators/IndicatorBar';
import NewAchievementShine from '../cosmetics/NewAchievementShine';

type StreakCardProps = {
    streak: number;
    record: number;
    title: string;
    actionDescription: string;
    image: string;
    alternativeText: string;
    actionType: ActionTypes;
};

const StreakCard: React.FC<StreakCardProps> = ({ streak, record, title, actionDescription, image, alternativeText, actionType }) => {
    const { t } = useTranslation();
    const isMobile = useBreakpointValue({ base: true, lg: false });
    return (
        <HStack
            backgroundColor="primary.900"
            width={isMobile ? '100%' : '350px'}
            maxWidth="350px"
            height="128px"
            padding="16px"
            alignItems="center"
            borderRadius={isMobile ? 0 : 8}
            space={2}
        >
            <VStack alignItems="center" width="90px">
                {streak === record && (
                    <VStack zIndex={1} position="absolute" width="90px" height="100%" alignItems="center" justifyContent="center">
                        <NewAchievementShine size={ShineSize.XSMALL} />
                    </VStack>
                )}
                <PresenceTransition
                    initial={{
                        scale: 0.75,
                    }}
                >
                    <AchievementImageContainer
                        image={image}
                        alternativeText={alternativeText}
                        achievementType={AchievementType.STREAK}
                        streak={streak}
                        isRecord={streak === record}
                        isMobile
                    />
                </PresenceTransition>
            </VStack>
            <VStack width={isMobile ? 'auto' : '215px'} maxWidth="215px" height="100%" justifyContent="space-between">
                <Text color="white">{title}</Text>
                <Text color="white" fontSize="xs">
                    <Trans>{t('achievement.streak.card.info', { streak })}</Trans>
                </Text>
                {streak === record ? (
                    <CardActionDescription actionType={actionType} actionDescription={actionDescription} isMobile={isMobile} isColorized />
                ) : (
                    <IndicatorBar maxSteps={record} currentStep={streak} />
                )}
            </VStack>
        </HStack>
    );
};

export default StreakCard;
