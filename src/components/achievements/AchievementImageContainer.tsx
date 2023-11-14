import { Box, VStack, PresenceTransition, Image, useBreakpointValue } from 'native-base';
import CompletePolaroid from './polaroid/CompletePolaroid';
import EmptyPolaroidField from './polaroid/EmptyPolaroidField';
import { AchievementState, AchievementType, StreakImageSize } from './types';
import StreakImageContainer from './streak/StreakImageContainer';
import { getPolaroidImageSize, getPuzzleSize, getPuzzleBorderRadius, breakpoints } from './helpers/achievement-image-helper';

type AchievementImageContainerProps = {
    image: string | undefined;
    alternativeText: string;
    achievementType: AchievementType;
    achievementState?: AchievementState;
    streak?: number;
    isRecord?: boolean;
    isLarge?: boolean;
};

const AchievementImageContainer: React.FC<AchievementImageContainerProps> = ({
    image,
    alternativeText,
    achievementType,
    achievementState,
    streak,
    isRecord,
    isLarge,
}) => {
    const breakpoint = useBreakpointValue({ base: breakpoints.base, md: breakpoints.md, lg: breakpoints.lg, xl: breakpoints.xl });
    const polaroidImageSize = getPolaroidImageSize(breakpoint, isLarge);
    const imageWrapperWidth = useBreakpointValue({ base: '100%', md: '142px' });
    switch (achievementType) {
        case AchievementType.TIERED:
            return (
                <VStack alignItems="center" width="fit-content">
                    {image && achievementState === AchievementState.COMPLETED ? (
                        <PresenceTransition
                            initial={{
                                rotate: '-5deg',
                            }}
                        >
                            <CompletePolaroid image={image} alternativeText={alternativeText} size={polaroidImageSize} />
                        </PresenceTransition>
                    ) : (
                        <EmptyPolaroidField size={polaroidImageSize} />
                    )}
                </VStack>
            );
        case AchievementType.STREAK:
            if (!image) return null;
            return (
                <VStack alignItems="center" width={imageWrapperWidth}>
                    <StreakImageContainer
                        streak={streak || 0}
                        image={image}
                        alternativeText={alternativeText}
                        size={isLarge ? StreakImageSize.LARGE : StreakImageSize.MEDIUM}
                        isRecord={isRecord}
                    />
                </VStack>
            );
        case AchievementType.SEQUENTIAL:
            const borderWidth = getPuzzleSize(breakpoint, isLarge);
            return (
                <Box width={borderWidth} height={borderWidth} borderRadius={getPuzzleBorderRadius(borderWidth)} overflow={'hidden'}>
                    <Image src={image} alt={alternativeText} width="100%" height="100%" />
                </Box>
            );
        default:
            return null;
    }
};

export default AchievementImageContainer;
