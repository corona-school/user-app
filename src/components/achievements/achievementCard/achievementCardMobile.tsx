import { Box, Stack, Text } from 'native-base';
import Theme from '../../../Theme';
import PolaroidImageContainer from '../polaroid/getPolaroidImage';
import AchievementBadge from '../achievementBadge';
import NewAchievementShine from '../cosmetics/newAchievementShine';
import IndicatorBar from '../progressIndicators/indicatorBar';
import CardActionDescription from './cardActionDescription';
import { AchievementState, ActionTypes } from '../types';

type AchievementCardMobileProps = {
    achievementState: AchievementState;
    actionType?: ActionTypes;
    image: string | undefined;
    alternativeText: string;
    newAchievement?: boolean;
    subtitle: string;
    title: string;
    maxSteps?: number;
    currentStep?: number;
    actionDescription?: string;
};

const AchievementCardMobile: React.FC<AchievementCardMobileProps> = ({
    achievementState,
    actionType,
    image,
    alternativeText,
    newAchievement,
    subtitle,
    title,
    maxSteps,
    currentStep,
    actionDescription,
}) => {
    return (
        <div
            style={{
                width: '100vw',
                height: 'fit-content',
            }}
        >
            <Box
                display={'flex'}
                flexDirection={'row'}
                alignItems={'center'}
                justifyContent="flex-start"
                width={'100%'}
                height={'114px'}
                padding={'16px'}
                backgroundColor={
                    achievementState === AchievementState.ACTIVE
                        ? Theme.colors.white
                        : achievementState === AchievementState.COMPLETED
                        ? Theme.colors.primary[900]
                        : Theme.colors.primary.translucent
                }
            >
                {newAchievement && achievementState === AchievementState.COMPLETED && (
                    <>
                        <AchievementBadge isMobile />
                        <NewAchievementShine isMobile />
                    </>
                )}
                <PolaroidImageContainer
                    image={achievementState === AchievementState.COMPLETED ? image : undefined}
                    alternativeText={alternativeText}
                    isMobile
                />
                <Stack space={2} alignItems={'left'} paddingLeft={'8px'} flex={1}>
                    <Stack space={0} alignItems={'left'}>
                        <Text fontSize="2xs" color={achievementState === AchievementState.COMPLETED ? Theme.colors.white : Theme.colors.primary[900]}>
                            {subtitle}
                        </Text>
                        <Text fontSize="md" color={achievementState === AchievementState.COMPLETED ? Theme.colors.white : Theme.colors.primary[900]} bold>
                            {title}
                        </Text>
                    </Stack>
                    {!maxSteps && actionDescription ? (
                        <CardActionDescription actionType={actionType} actionDescription={actionDescription} isMobile />
                    ) : (
                        <>
                            {actionDescription && <CardActionDescription actionType={actionType} actionDescription={actionDescription} isMobile />}
                            {achievementState !== AchievementState.COMPLETED && maxSteps && (
                                <IndicatorBar maxSteps={maxSteps} currentStep={currentStep} isMobile />
                            )}
                        </>
                    )}
                </Stack>
            </Box>
        </div>
    );
};

export default AchievementCardMobile;
