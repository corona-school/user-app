import { Box, VStack } from 'native-base';
import StreakImage from './StreakImage';
import StarBackgroundOne from '../../../assets/images/achievements/star_bg_1.svg';
import StarBackgroundTwo from '../../../assets/images/achievements/star_bg_2.svg';
import StreakSparks from '../../../assets/images/achievements/streak_sparks.svg';
import { StreakImageSize } from '../../../types/achievement';

type StreakImageContainerProps = {
    streak: number;
    image: string;
    alternativeText: string;
    size: StreakImageSize;
    isRecord?: boolean;
};

const StreakImageContainer: React.FC<StreakImageContainerProps> = ({ streak, image, alternativeText, size, isRecord }) => {
    let imageSize: number;
    switch (size) {
        case StreakImageSize.SMALL:
            imageSize = 52;
            break;
        case StreakImageSize.MEDIUM:
            imageSize = 120;
            break;
        case StreakImageSize.LARGE:
            imageSize = 180;
            break;
        default:
            imageSize = 120;
    }
    const sparkSize = `${imageSize * 1.5}px`;
    return (
        <VStack justifyContent={'center'} alignItems="center" width={size}>
            {isRecord && (
                <VStack position={'absolute'} justifyContent={'center'} alignItems={'center'} width={sparkSize} height={size}>
                    <Box position={'absolute'} width={size}>
                        <StarBackgroundOne />
                    </Box>
                    <Box position={'absolute'} width={size}>
                        <StarBackgroundTwo />
                    </Box>
                </VStack>
            )}
            <StreakImage streak={streak} image={image} alternativeText={alternativeText} size={size} />
            {isRecord && (
                <Box position={'absolute'} width={sparkSize} height={sparkSize}>
                    <StreakSparks />
                </Box>
            )}
        </VStack>
    );
};

export default StreakImageContainer;

export { StreakImageSize };
