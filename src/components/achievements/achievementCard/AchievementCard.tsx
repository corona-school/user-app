import { Pressable, Stack, Text, VStack, useBreakpointValue } from 'native-base';
import AchievementImageContainer from '../AchievementImageContainer';
import AchievementBadge from '../AchievementBadge';
import NewAchievementShine from '../cosmetics/NewAchievementShine';
import IndicatorBar from '../progressIndicators/IndicatorBar';
import CardProgressDescription from './CardProgressDescription';
import { PolaroidImageSize, ShineSize } from '../../../types/achievement';
import InnerShadow from '../cosmetics/InnerShadow';
import { Achievement_Action_Type_Enum, Achievement_State, Achievement_Type_Enum } from '../../../gql/graphql';

type AchievementCardProps = {
    achievementState: Achievement_State;
    achievementType: Achievement_Type_Enum;
    actionType?: Achievement_Action_Type_Enum | null;
    image: string | undefined;
    alternativeText: string;
    isNewAchievement?: boolean;
    subtitle: string;
    title: string;
    maxSteps?: number;
    currentStep?: number;
    progressDescription?: string;
    onClick?: () => void;
};

const AchievementCard: React.FC<AchievementCardProps> = ({
    achievementState,
    achievementType,
    actionType,
    image,
    alternativeText,
    isNewAchievement,
    subtitle,
    title,
    maxSteps,
    currentStep,
    progressDescription,
    onClick,
}) => {
    const alignItems = useBreakpointValue({ base: 'flex-start', md: 'center' });
    const shineOffsetLeft = useBreakpointValue({ base: '15px', md: 'none' });
    const shineOffsetTop = useBreakpointValue({ base: '-10px', md: '-10px' });
    const showInnerShadow = useBreakpointValue({ base: false, md: true });
    const cardFlexDirection = useBreakpointValue({ base: 'row', md: 'column' });
    const justifyCardContentMobile = useBreakpointValue({ base: 'flex-end', md: 'center' });
    const justifyCardContentUnfinished = useBreakpointValue({
        base: 'flex-start',
        md: achievementType === Achievement_Type_Enum.Sequential ? 'space-between' : justifyCardContentMobile,
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
    const polaroidImageSize = useBreakpointValue({
        base: { width: '64px', height: '84px' },
        md: { width: PolaroidImageSize.LARGE, height: PolaroidImageSize.LARGE },
    });
    const shineSize = useBreakpointValue({ base: ShineSize.XSMALL, md: ShineSize.MEDIUM });
    const textSpace = useBreakpointValue({ base: 2, md: 5 });
    const textPaddingLeft = useBreakpointValue({ base: '12px', md: '0' });
    const indicatorTextSpace = useBreakpointValue({ base: 0, md: 2 });
    const indicatorFirst = useBreakpointValue({ base: false, md: true });
    const indicatorSecond = useBreakpointValue({ base: true, md: false });
    const colorozeCard = useBreakpointValue({ base: true, md: false });
    return (
        <Pressable onPress={onClick}>
            <VStack width={width} height="fit-content" borderRadius="8px" alignItems={alignItems} justifyContent="center" overflow="visible">
                {showInnerShadow && achievementState === Achievement_State.Inactive && <InnerShadow deviation={7.5} opacity={0.5} />}
                {isNewAchievement && achievementState === Achievement_State.Completed && (
                    <>
                        <AchievementBadge />
                        <VStack
                            position="absolute"
                            zIndex={1}
                            justifyContent="center"
                            alignItems="center"
                            left={shineOffsetLeft}
                            top={shineOffsetTop}
                            width={polaroidImageSize.width}
                            height={polaroidImageSize.height}
                        >
                            <NewAchievementShine size={shineSize} />
                        </VStack>
                    </>
                )}
                <Stack
                    direction={cardFlexDirection}
                    alignItems="center"
                    justifyContent={achievementState !== Achievement_State.Completed ? 'space-between' : justifyCardContentUnfinished}
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
                    <Stack paddingY={achievementType === Achievement_Type_Enum.Sequential ? 4 : 0}>
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
                                {subtitle}
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
                        {achievementState !== Achievement_State.Completed && (
                            <VStack space={indicatorTextSpace} width="100%">
                                {indicatorFirst && maxSteps && <IndicatorBar maxSteps={maxSteps} currentStep={currentStep} centerText />}
                                {progressDescription && (
                                    <CardProgressDescription actionType={actionType} progressDescription={progressDescription} isColorized={colorozeCard} />
                                )}
                                {indicatorSecond && maxSteps && <IndicatorBar maxSteps={maxSteps} currentStep={currentStep} centerText />}
                            </VStack>
                        )}
                    </VStack>
                </Stack>
            </VStack>
        </Pressable>
    );
};

export default AchievementCard;
