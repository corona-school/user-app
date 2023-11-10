import Theme from '../../../Theme';
import { Box, Text, VStack } from 'native-base';
import { useTranslation } from 'react-i18next';
import { StreakImageSize } from '../types';
import { getStreakFontSize, getStreakImageSize, getStreakTextOffset } from './streak-image-helper';

type StreakImageProps = {
    streak: number;
    image: string;
    alternativeText: string;
    size: StreakImageSize;
};

const StreakImage: React.FC<StreakImageProps> = ({ streak, image, alternativeText, size }) => {
    const { t } = useTranslation();
    return (
        <VStack justifyContent="center" alignItems="center" width={size} height={size}>
            <VStack position="absolute" width={getStreakImageSize(size)} height="100%" justifyContent="center">
                <img width={'100%'} src={image} alt="" aria-hidden />
            </VStack>
            <Box aria-label={alternativeText} position="relative" zIndex={1} top={getStreakTextOffset(size)}>
                <Text color={Theme.colors.white} fontSize={getStreakFontSize(size)}>
                    {t('achievement.streak.count', { streak })}
                </Text>
            </Box>
        </VStack>
    );
};

export default StreakImage;
