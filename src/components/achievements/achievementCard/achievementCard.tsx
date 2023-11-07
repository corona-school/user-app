import { Box, Stack, Text, VStack, useBreakpointValue } from 'native-base';
import PolaroidImageContainer from '../polaroid/PolaroidImageContainer';
import AchievementBadge from '../AchievementBadge';
import NewAchievementShine from '../cosmetics/NewAchievementShine';
import IndicatorBar from '../progressIndicators/IndicatorBar';
import CardActionDescription from './CardActionDescription';
import { AchievementState, ActionTypes } from '../types';

type AchievementCardProps = {
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
    isMobile?: boolean;
};

const AchievementCard: React.FC<AchievementCardProps> = ({
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
                        boxShadow: `${
                            achievementState === AchievementState.INACTIVE ? '0px 0px 15px 0px #0000000D inset' : '0px 2px 4px 0px rgba(0, 0, 0, 0.25)'
                        }`,
                    }}
                />
            )}
            <Stack
                direction={isMobile ? 'row' : 'column'}
                alignItems="center"
                justifyContent={achievementState !== AchievementState.COMPLETED ? 'flex-start' : isMobile ? 'flex-start' : 'center'}
                width={isMobile ? '100%' : '280px'}
                height={isMobile ? '114px' : achievementState === AchievementState.COMPLETED ? '300px' : '360px'}
                borderColor={achievementState === AchievementState.COMPLETED ? 'primary.900' : 'primary.grey'}
                borderRadius={isMobile ? 'none' : '8px'}
                borderWidth={isMobile ? 'none' : '1px'}
                paddingY="16px"
                paddingX={isMobile ? '16px' : '32px'}
                borderStyle={achievementState === AchievementState.INACTIVE ? 'dashed' : 'solid'}
                backgroundColor={
                    achievementState === AchievementState.ACTIVE
                        ? 'white'
                        : achievementState === AchievementState.COMPLETED
                        ? 'primary.900'
                        : 'primary.transparent'
                }
            >
                {newAchievement && achievementState === AchievementState.COMPLETED && (
                    <>
                        <AchievementBadge isMobile={isMobile} />
                        <NewAchievementShine isMobile={isMobile} />
                    </>
                )}
                <PolaroidImageContainer
                    image={achievementState === AchievementState.COMPLETED ? image : undefined}
                    alternativeText={alternativeText}
                    isMobile={isMobile}
                />
                <VStack space={isMobile ? 2 : 5} alignItems={isMobile ? 'left' : 'center'} paddingLeft={isMobile ? '8px' : '0'}>
                    <Stack space={0} alignItems={isMobile ? 'left' : 'center'}>
                        <Text fontSize="xs" color={achievementState === AchievementState.COMPLETED ? 'white' : 'primary.900'}>
                            {subtitle}
                        </Text>
                        <Text fontSize="md" color={achievementState === AchievementState.COMPLETED ? 'white' : 'primary.900'} bold>
                            {title}
                        </Text>
                    </Stack>
                    <VStack space={isMobile ? '0' : 'sm'} width="100%">
                        {!isMobile && maxSteps && achievementState !== AchievementState.COMPLETED && maxSteps && (
                            <IndicatorBar maxSteps={maxSteps} currentStep={currentStep} />
                        )}
                        {actionDescription && <CardActionDescription actionType={actionType} actionDescription={actionDescription} isMobile={isMobile} />}
                        {isMobile && maxSteps && achievementState !== AchievementState.COMPLETED && maxSteps && (
                            <IndicatorBar maxSteps={maxSteps} currentStep={currentStep} isMobile />
                        )}
                    </VStack>
                </VStack>
            </Stack>
        </Box>
    );
};

export default AchievementCard;
