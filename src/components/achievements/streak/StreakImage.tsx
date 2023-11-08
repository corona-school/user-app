import Theme from '../../../Theme';
import { Text, VStack } from 'native-base';
import ExampleStreakUnfinished from '../../../assets/images/achievements/example_streak_unfinished.svg';
import { useTranslation } from 'react-i18next';

type StreakImageProps = {
    streak: number;
    image: string;
    alternativeText: string;
    isMobile?: boolean;
    isLarge?: boolean;
};

const StreakImage: React.FC<StreakImageProps> = ({ streak, image, alternativeText, isMobile, isLarge }) => {
    const { t } = useTranslation();
    return (
        <VStack
            justifyContent="flex-start"
            alignItems="center"
            width={isMobile && !isLarge ? '60px' : '136px'}
            height={isMobile && !isLarge ? '80px' : '184px'}
            paddingTop={isMobile ? '4px' : '7.5px'}
        >
            <VStack justifyContent="center" alignItems="center" width={isMobile && !isLarge ? '52px' : '120px'} overflow="hidden">
                {/* <img width={'100%'} src={image} alt='' aria-hidden /> */}
                <ExampleStreakUnfinished />
                <div
                    aria-label={alternativeText}
                    style={{
                        position: 'absolute',
                        zIndex: 1,
                        transform: `translateY(${isMobile && !isLarge ? '-4px' : '-8px'})`,
                    }}
                >
                    <Text color={Theme.colors.white} fontSize={isMobile && !isLarge ? '12px' : '32px'}>
                        {t('achievement.streak.count', { streak })}
                    </Text>
                </div>
            </VStack>
        </VStack>
    );
};

export default StreakImage;
