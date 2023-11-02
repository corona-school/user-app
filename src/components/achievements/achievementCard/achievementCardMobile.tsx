import { Box, Stack, Text } from 'native-base';
import Theme from '../../../Theme';
import PolaroidImageContainer from '../polaroid/getPolaroidImage';
import AchievementBadge from '../achievementBadge';
import NewAchievementShine from './newAchievementShine';
import IndicatorBar from '../progressIndicators/indicatorBar';
import CardActionDescription from './cardActionDescription';

enum ActionTypes {
    ACTION = 'ACTION',
    WAIT = 'WAIT',
    APPOINTMENT = 'APPOINTMENT',
    INFO = 'INFO',
}

enum CardState {
    INACTIVE = 'INACTIVE',
    ACTIVE = 'ACTIVE',
    COMPLETED = 'COMPLETED',
}

type AchievementCardMobileProps = {
    cardState: CardState;
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
    cardState,
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
                width: '100%',
                height: 'fit-content',
                borderRadius: '8px',
            }}
        >
            <Box
                display={'flex'}
                flexDirection={'row'}
                alignItems={'center'}
                justifyContent="flex-start"
                width="100%"
                height={'114px'}
                padding={'16px'}
                backgroundColor={
                    cardState === CardState.ACTIVE
                        ? Theme.colors.white
                        : cardState === CardState.COMPLETED
                        ? Theme.colors.primary[900]
                        : Theme.colors.primary.translucent
                }
            >
                {newAchievement && cardState === CardState.COMPLETED && (
                    <>
                        <AchievementBadge isMobile />
                        <NewAchievementShine isMobile />
                    </>
                )}
                <PolaroidImageContainer image={cardState === CardState.COMPLETED ? image : undefined} alternativeText={alternativeText} isMobile />
                <Stack space={2} alignItems={'left'} paddingLeft={'8px'} flex={1}>
                    <Stack space={0} alignItems={'left'}>
                        <Text fontSize="2xs" color={cardState === CardState.COMPLETED ? Theme.colors.white : Theme.colors.primary[900]}>
                            {subtitle}
                        </Text>
                        <Text fontSize="md" color={cardState === CardState.COMPLETED ? Theme.colors.white : Theme.colors.primary[900]} bold>
                            {title}
                        </Text>
                    </Stack>
                    {!maxSteps && actionDescription ? (
                        <CardActionDescription actionType={actionType} actionDescription={actionDescription} isMobile />
                    ) : (
                        <>
                            {actionDescription && <CardActionDescription actionType={actionType} actionDescription={actionDescription} isMobile />}
                            {cardState !== CardState.COMPLETED && maxSteps && <IndicatorBar maxSteps={maxSteps} currentStep={currentStep} isMobile />}
                        </>
                    )}
                </Stack>
            </Box>
        </div>
    );
};

export default AchievementCardMobile;

export { CardState, ActionTypes };
