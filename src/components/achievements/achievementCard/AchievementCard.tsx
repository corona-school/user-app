import { Pressable, Stack, Text, VStack, useBreakpointValue } from 'native-base';
import AchievementImageContainer from '../AchievementImageContainer';
import AchievementBadge from '../AchievementBadge';
import NewAchievementShine from '../cosmetics/NewAchievementShine';
import IndicatorBar from '../progressIndicators/IndicatorBar';
import CardProgressDescription from './CardProgressDescription';
import InnerShadow from '../cosmetics/InnerShadow';
import { Achievement_Action_Type_Enum, Achievement_State, Achievement_Type_Enum } from '../../../gql/graphql';

type AchievementCardProps = {
    achievementState: Achievement_State;
    achievementType: Achievement_Type_Enum;
    actionType?: Achievement_Action_Type_Enum | null;
    image: string | undefined;
    alternativeText: string;
    isNewAchievement?: boolean;
    tagline?: string;
    title: string;
    maxSteps?: number;
    currentStep?: number;
    progressDescription: string;
    actionName?: string;
    showProgressBar: boolean;
    onClick?: () => void;
};

/**
 * An Achievement Card is a card that displays the user"s achievements based on their successes.
 */
const AchievementCard: React.FC<AchievementCardProps> = ({
    achievementState,
    achievementType,
    actionType,
    image,
    alternativeText,
    isNewAchievement,
    tagline,
    title,
    maxSteps,
    currentStep,
    progressDescription,
    actionName,
    showProgressBar,
    onClick,
}) => {
    const alignItems = useBreakpointValue({ base: 'flex-start', md: 'center' });
    const showInnerShadow = useBreakpointValue({ base: false, md: true });
    const cardFlexDirection = useBreakpointValue({ base: 'row', md: 'column' });
    const justifyCardContent = useBreakpointValue({
        base: 'flex-start',
        md: achievementType === Achievement_Type_Enum.Sequential && achievementState === Achievement_State.Active ? 'space-between' : 'center',
    });
    const cardSpacing = useBreakpointValue({ base: 0, md: 2 });
    const width = useBreakpointValue({ base: '100%', md: '280px' });
    const maxTextWidth = useBreakpointValue({ base: 'calc(100% - 64px)', md: '100%' });
    const textAlignment = useBreakpointValue({ base: 'left', md: 'center' });
    const textContainerWidth = useBreakpointValue({ base: '100%', md: '214px' });
    const cardHeight = useBreakpointValue({ base: '114px', md: achievementState === Achievement_State.Completed ? '300px' : '360px' });
    const borderWidth = useBreakpointValue({ base: 'none', md: '1px' });
    const paddingX = useBreakpointValue({ base: '16px', md: '32px' });
    const bgColorIncomplete = useBreakpointValue({ base: 'white', md: 'gray.50' });
    const commonCardImageSize = useBreakpointValue({ base: 'auto', md: '190px' });
    const textSpace = useBreakpointValue({ base: 2, md: 5 });
    const textPaddingLeft = useBreakpointValue({ base: '12px', md: '0' });
    const progressBarLargeText = useBreakpointValue({ base: false, md: true });
    return (
        <Pressable disabled={achievementState === Achievement_State.Inactive} onPress={onClick}>
            <VStack width={width} height="fit-content" borderRadius="8px" alignItems={alignItems} justifyContent="center" overflow="visible">
                {showInnerShadow && achievementState === Achievement_State.Inactive && <InnerShadow deviation={7.5} opacity={0.5} />}
                {isNewAchievement && (
                    <>
                        <AchievementBadge />
                        <div className="absolute inset-0 z-10 overflow-hidden">
                            <NewAchievementShine />
                        </div>
                    </>
                )}
                <Stack
                    direction={cardFlexDirection}
                    alignItems="center"
                    justifyContent={justifyCardContent}
                    space={cardSpacing}
                    width={width}
                    height={cardHeight}
                    borderColor={achievementState === Achievement_State.Completed ? 'primary.900' : 'primary.grey'}
                    borderRadius="8px"
                    borderWidth={borderWidth}
                    paddingY={'16px'}
                    paddingX={paddingX}
                    borderStyle={achievementState === Achievement_State.Inactive ? 'dashed' : 'solid'}
                    backgroundColor={
                        achievementState === Achievement_State.Active
                            ? 'white'
                            : achievementState === Achievement_State.Completed
                            ? 'primary.900'
                            : bgColorIncomplete
                    }
                >
                    <Stack height={commonCardImageSize} paddingY={achievementType === Achievement_Type_Enum.Sequential ? 4 : 0}>
                        <AchievementImageContainer
                            image={achievementState !== Achievement_State.Completed && achievementType === Achievement_Type_Enum.Tiered ? undefined : image}
                            alternativeText={alternativeText}
                            achievementType={achievementType}
                            achievementState={achievementState}
                        />
                    </Stack>
                    <VStack space={textSpace} alignItems={textAlignment} paddingLeft={textPaddingLeft} width={maxTextWidth}>
                        <Stack space="1" alignItems={textAlignment} width={textContainerWidth}>
                            <Text
                                fontSize="12px"
                                color={achievementState === Achievement_State.Completed ? 'white' : 'primary.900'}
                                width="100%"
                                textAlign={textAlignment}
                            >
                                {tagline}
                            </Text>
                            <Text
                                width="100%"
                                fontSize="16px"
                                lineHeight="sm"
                                color={achievementState === Achievement_State.Completed ? 'white' : 'primary.900'}
                                bold
                                numberOfLines={2}
                                overflow="hidden"
                                textAlign={textAlignment}
                            >
                                {title}
                            </Text>
                        </Stack>
                        {showProgressBar && (
                            <VStack space="0" width="100%">
                                {maxSteps && (
                                    <IndicatorBar
                                        maxSteps={maxSteps}
                                        currentStep={currentStep}
                                        progressDescription={progressDescription}
                                        fullWidth
                                        isCard
                                        largeText={progressBarLargeText}
                                    />
                                )}
                                {actionName && <CardProgressDescription actionType={actionType} progressDescription={actionName} />}
                            </VStack>
                        )}
                    </VStack>
                </Stack>
            </VStack>
        </Pressable>
    );
};

export default AchievementCard;
