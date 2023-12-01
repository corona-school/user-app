import { Box, VStack, PresenceTransition, Image, useBreakpointValue } from 'native-base';
import CompletePolaroid from './polaroid/CompletePolaroid';
import EmptyPolaroidField from './polaroid/EmptyPolaroidField';
import { AchievementState, AchievementType, PuzzleImageSize, StreakImageSize } from '../../types/achievement';
import StreakImageContainer from './streak/StreakImageContainer';

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
    const puzzleBorderWidth = useBreakpointValue({
        base: isLarge ? PuzzleImageSize.MEDIUM : PuzzleImageSize.SMALL,
        md: PuzzleImageSize.MEDIUM,
        lg: isLarge ? PuzzleImageSize.LARGE : PuzzleImageSize.MEDIUM,
    });
    const streakImageSize = useBreakpointValue({
        base: isLarge ? StreakImageSize.LARGE : StreakImageSize.SMALL,
        md: isLarge ? StreakImageSize.LARGE : StreakImageSize.SMALL,
    });
    const puzzleBorderRadius = useBreakpointValue({ base: isLarge ? '3px' : '2px', md: '3px', lg: isLarge ? '4px' : '3px' });
    const shadow = useBreakpointValue({ base: 3, md: 5, lg: 9 });
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
                            <CompletePolaroid image={image} alternativeText={alternativeText} isLarge={isLarge} />
                        </PresenceTransition>
                    ) : (
                        <EmptyPolaroidField isLarge={isLarge} />
                    )}
                </VStack>
            );
        case AchievementType.STREAK:
            if (!image) return null;
            return (
                <VStack alignItems="center" width={streakImageSize}>
                    <StreakImageContainer streak={streak || 0} image={image} alternativeText={alternativeText} size={streakImageSize} isRecord={isRecord} />
                </VStack>
            );
        case AchievementType.SEQUENTIAL:
            return (
                <Box
                    width={puzzleBorderWidth}
                    height={puzzleBorderWidth}
                    borderRadius={puzzleBorderRadius}
                    overflow={'hidden'}
                    shadow={achievementState === AchievementState.COMPLETED && shadow}
                >
                    <Image src={image} alt={alternativeText} width="100%" height="100%" />
                </Box>
            );
        default:
            return null;
    }
};

export default AchievementImageContainer;
