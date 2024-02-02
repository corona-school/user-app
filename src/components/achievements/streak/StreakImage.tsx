import { Box, Image, Text, VStack } from 'native-base';
import { useTranslation } from 'react-i18next';
import { StreakImageSize } from '../../../types/achievement';

type StreakImageProps = {
    streak: number;
    image: string;
    alternativeText: string;
    size: StreakImageSize;
    isRecord?: boolean;
};

const StreakImage: React.FC<StreakImageProps> = ({ streak, image, alternativeText, size, isRecord }) => {
    const { t } = useTranslation();
    const streakTextOffset = size === StreakImageSize.SMALL ? '-4px' : size === StreakImageSize.LARGE ? '-12px' : '-8px';
    const streakFontSize = size === StreakImageSize.SMALL ? '24px' : size === StreakImageSize.LARGE ? '48px' : '24px';

    return (
        <VStack justifyContent="center" alignItems="center" width={size} height={size}>
            <VStack position="absolute" width={`calc(${size}*1.3)`} height={`calc(${size}*1.3)`} justifyContent="center">
                <Image width={`calc(${size}*1.3)`} height={`calc(${size}*1.3)`} resizeMode="contain" src={image} alt={alternativeText} />
            </VStack>
            <Box aria-label={alternativeText} position="relative" zIndex={1} top={streakTextOffset}>
                <Text color={isRecord ? 'white' : 'gray.200'} fontSize={streakFontSize} bold>
                    {t('achievement.streak.count', { streak })}
                </Text>
            </Box>
        </VStack>
    );
};

export default StreakImage;
