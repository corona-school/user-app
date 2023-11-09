import { Box, VStack, PresenceTransition, Image } from 'native-base';
import CompletePolaroid from './polaroid/CompletePolaroid';
import EmptyPolaroidField from './polaroid/EmptyPolaroidField';
import { AchievementType, StreakImageSize } from './types';
import StreakImageContainer from './streak/StreakImageContainer';
import { getPolaroidImageSize, getPuzzleSize, getPuzzleBorderRadius } from './helpers/achievement-image-helper';

type AchievementImageContainerProps = {
    image: string | undefined;
    alternativeText: string;
    achievementType: AchievementType;
    streak?: number;
    isRecord?: boolean;
    isMobile?: boolean;
    isTablet?: boolean;
    isLarge?: boolean;
};

const AchievementImageContainer: React.FC<AchievementImageContainerProps> = ({
    image,
    alternativeText,
    achievementType,
    streak,
    isRecord,
    isMobile,
    isTablet,
    isLarge,
}) => {
    switch (achievementType) {
        case AchievementType.TIERED:
            return (
                <VStack alignItems="center" width="fit-content">
                    {image ? (
                        <PresenceTransition
                            initial={{
                                rotate: '-5deg',
                            }}
                        >
                            <CompletePolaroid image={image} alternativeText={alternativeText} size={getPolaroidImageSize(isMobile, isTablet, isLarge)} />
                        </PresenceTransition>
                    ) : (
                        <EmptyPolaroidField size={getPolaroidImageSize(isMobile, isTablet, isLarge)} />
                    )}
                </VStack>
            );
        case AchievementType.STREAK:
            if (!streak || !image) return null;
            return (
                <VStack marginLeft={isMobile || isTablet ? 0 : '40px'} alignItems="center" width={isMobile ? '100%' : '142px'}>
                    <StreakImageContainer
                        streak={streak}
                        image={image}
                        alternativeText={alternativeText}
                        size={isMobile ? StreakImageSize.MEDIUM : StreakImageSize.LARGE}
                        isRecord={isRecord}
                    />
                </VStack>
            );
        case AchievementType.SEQUENTIAL:
            const borderWidth = getPuzzleSize(isMobile, isTablet);
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
