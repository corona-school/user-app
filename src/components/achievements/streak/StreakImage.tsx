import Theme from '../../../Theme';
import { Box, Image, Text, VStack } from 'native-base';
import { useTranslation } from 'react-i18next';
import { StreakImageSize } from '../../../types/achievement';

type StreakImageProps = {
    streak: number;
    image: string;
    alternativeText: string;
    size: StreakImageSize;
};

const StreakImage: React.FC<StreakImageProps> = ({ streak, image, alternativeText, size }) => {
    const { t } = useTranslation();
    const imageSize = size === StreakImageSize.SMALL ? '52px' : StreakImageSize.LARGE ? '180px' : '120px';
    const streakTextOffset = size === StreakImageSize.SMALL ? '-4px' : size === StreakImageSize.LARGE ? '-12px' : '-8px';
    const streakFontSize = size === StreakImageSize.SMALL ? '12px' : size === StreakImageSize.LARGE ? '48px' : '32px';

    return (
        <VStack justifyContent="center" alignItems="center" width={size} height={size}>
            <VStack position="absolute" width={imageSize} height={imageSize} justifyContent="center">
                <Image width="100%" height="100%" src={image} alt={alternativeText} aria-hidden />
            </VStack>
            <Box aria-label={alternativeText} position="relative" zIndex={1} top={streakTextOffset}>
                <Text color={Theme.colors.white} fontSize={streakFontSize}>
                    {t('achievement.streak.count', { streak })}
                </Text>
            </Box>
        </VStack>
    );
};

export default StreakImage;
