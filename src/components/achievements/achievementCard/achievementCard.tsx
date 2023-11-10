import { Box, Stack, Text, VStack, useBreakpointValue } from 'native-base';
import PolaroidImageContainer from '../polaroid/PolaroidImageContainer';
import AchievementBadge from '../AchievementBadge';
import NewAchievementShine from './NewAchievementShine';
import IndicatorBar from '../progressIndicators/IndicatorBar';
import CardActionDescription from './CardActionDescription';

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

type AchievementCardProps = {
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
    isMobile?: boolean;
};

const AchievementCard: React.FC<AchievementCardProps> = ({
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
    const isMobile = useBreakpointValue({
        base: true,
        lg: false,
    });
    return (
        <Box width="fit-content" height="fit-content" borderRadius="8px">
            {!isMobile && (
                // This is the shadow of desktop cards. They have to be implemented with a div, since native base shadow prop has no inset option.
                <div
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        borderRadius: '8px',
                        boxShadow: `${cardState === CardState.INACTIVE ? '0px 0px 15px 0px #0000000D inset' : '0px 2px 4px 0px rgba(0, 0, 0, 0.25)'}`,
                    }}
                />
            )}
            <Stack
                direction={isMobile ? 'row' : 'column'}
                alignItems="center"
                justifyContent={cardState !== CardState.COMPLETED ? 'flex-start' : isMobile ? 'flex-start' : 'center'}
                width={isMobile ? '100%' : '280px'}
                height={isMobile ? '114px' : cardState === CardState.COMPLETED ? '300px' : '360px'}
                borderColor={cardState === CardState.COMPLETED ? 'primary.900' : 'primary.grey'}
                borderRadius={isMobile ? 'none' : '8px'}
                borderWidth={isMobile ? 'none' : '1px'}
                paddingY="16px"
                paddingX={isMobile ? '16px' : '32px'}
                borderStyle={cardState === CardState.INACTIVE ? 'dashed' : 'solid'}
                backgroundColor={cardState === CardState.ACTIVE ? 'white' : cardState === CardState.COMPLETED ? 'primary.900' : 'primary.transparent'}
            >
                {newAchievement && cardState === CardState.COMPLETED && (
                    <>
                        <AchievementBadge isMobile={isMobile} />
                        <NewAchievementShine isMobile={isMobile} />
                    </>
                )}
                <PolaroidImageContainer image={cardState === CardState.COMPLETED ? image : undefined} alternativeText={alternativeText} isMobile={isMobile} />
                <VStack space={isMobile ? 2 : 5} alignItems={isMobile ? 'left' : 'center'} paddingLeft={isMobile ? '8px' : '0'}>
                    <Stack space={0} alignItems={isMobile ? 'left' : 'center'}>
                        <Text fontSize={isMobile ? '2xs' : 'xs'} color={cardState === CardState.COMPLETED ? 'white' : 'primary.900'}>
                            {subtitle}
                        </Text>
                        <Text fontSize="md" color={cardState === CardState.COMPLETED ? 'white' : 'primary.900'} bold>
                            {title}
                        </Text>
                    </Stack>
                    {cardState !== CardState.COMPLETED && (
                        <VStack space={isMobile ? '0' : 'sm'} width="100%">
                            {!isMobile && maxSteps && <IndicatorBar maxSteps={maxSteps} currentStep={currentStep} />}
                            {actionDescription && <CardActionDescription actionType={actionType} actionDescription={actionDescription} isMobile={isMobile} />}
                            {isMobile && maxSteps && <IndicatorBar maxSteps={maxSteps} currentStep={currentStep} isMobile />}
                        </VStack>
                    )}
                </VStack>
            </Stack>
        </Box>
    );
};

export default AchievementCard;

export { CardState, ActionTypes };
