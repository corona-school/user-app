import { Box, VStack, PresenceTransition } from 'native-base';
import CompletePolaroid from './CompletePolaroid';
import EmptyPolaroidField from './EmptyPolaroidField';
import { AchievementType } from '../types';
import StreakImageContainer from '../streak/StreakImageContainer';

type AchievementImageContainerProps = {
    image: string | undefined;
    alternativeText: string;
    achievementType: AchievementType;
    streak?: number;
    isRecord?: boolean;
    isMobile?: boolean;
    isLarge?: boolean;
};

const AchievementImageContainer: React.FC<AchievementImageContainerProps> = ({
    image,
    alternativeText,
    achievementType,
    streak,
    isRecord,
    isMobile,
    isLarge,
}) => {
    switch (achievementType) {
        case AchievementType.TIERED:
            return (
                <VStack alignItems="center" marginLeft={isMobile || !isLarge ? 0 : '40px'} width={isMobile ? '100%' : '142px'}>
                    {image ? (
                        <PresenceTransition
                            initial={{
                                rotate: '-5deg',
                                translateY: isMobile ? 0 : -15,
                                scale: isLarge && !isMobile ? 1.5 : 1,
                            }}
                        >
                            <CompletePolaroid image={image} alternativeText={alternativeText} isMobile={isMobile} isLarge={isLarge} />
                        </PresenceTransition>
                    ) : (
                        <PresenceTransition
                            initial={{
                                translateY: isLarge && !isMobile ? 25 : 0,
                                scale: isLarge && !isMobile ? 1.5 : 1,
                            }}
                        >
                            <EmptyPolaroidField isMobile={isMobile} />
                        </PresenceTransition>
                    )}
                </VStack>
            );
        case AchievementType.STREAK:
            if (!streak || !image) return null;
            return (
                <VStack marginLeft={isMobile ? 0 : '40px'} alignItems="center" height="100%">
                    <StreakImageContainer
                        streak={streak}
                        image={image}
                        alternativeText={alternativeText}
                        isRecord={isRecord}
                        isMobile={isMobile}
                        isLarge={isLarge}
                    />
                </VStack>
            );
        case AchievementType.SEQUENTIAL:
            return <Box></Box>;
        default:
            return null;
    }
};

export default AchievementImageContainer;
