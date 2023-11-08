import { Box, PresenceTransition, VStack } from 'native-base';
import StreakImage from './StreakImage';
import StarBackgroundOne from '../../../assets/images/achievements/star_bg_1.svg';
import StarBackgroundTwo from '../../../assets/images/achievements/star_bg_2.svg';
import StreakSparks from '../../../assets/images/achievements/streak_sparks.svg';

type StreakImageContainerProps = {
    streak: number;
    image: string;
    alternativeText: string;
    isRecord?: boolean;
    isMobile?: boolean;
    isLarge?: boolean;
};

const StreakImageContainer: React.FC<StreakImageContainerProps> = ({ streak, image, alternativeText, isRecord, isMobile, isLarge }) => {
    const shineSize = isMobile && !isLarge ? 60 : 160;
    const shineOffsetY = isMobile ? 15 : 30;

    return (
        <VStack width={'fit-content'} height={'fit-content'} justifyContent={'center'} alignItems="center">
            <PresenceTransition
                initial={{
                    translateY: isMobile ? 0 : 60,
                    scale: isLarge ? 1.5 : 1,
                }}
            >
                {isRecord && (
                    <VStack position={'absolute'} justifyContent={'center'} alignItems={'center'} width={'100%'} height={'100%'} top={-shineOffsetY}>
                        <Box position={'absolute'} width={`${shineSize}px`}>
                            <StarBackgroundOne />
                        </Box>
                        <Box position={'absolute'} width={`${shineSize}px`}>
                            <StarBackgroundTwo />
                        </Box>
                    </VStack>
                )}
                <StreakImage streak={streak} image={image} alternativeText={alternativeText} isMobile={isMobile} isLarge={isLarge} />
            </PresenceTransition>
            {isRecord && (
                <Box position={'absolute'} width={'100%'} height={'100%'} top={-shineOffsetY}>
                    <PresenceTransition
                        initial={{
                            translateY: isMobile && isLarge ? 0 : isMobile ? 15 : 60,
                            scale: isLarge ? 1.5 : 1,
                        }}
                    >
                        <StreakSparks />
                    </PresenceTransition>
                </Box>
            )}
        </VStack>
    );
};

export default StreakImageContainer;
