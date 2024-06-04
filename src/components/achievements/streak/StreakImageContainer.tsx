import { VStack } from 'native-base';
import StreakImage from './StreakImage';
import { StreakImageSize } from '../../../types/achievement';

type StreakImageContainerProps = {
    streak: number;
    image: string;
    alternativeText: string;
    size: StreakImageSize;
    isRecord?: boolean;
};

const StreakImageContainer: React.FC<StreakImageContainerProps> = ({ streak, image, alternativeText, size, isRecord }) => {
    return (
        <VStack justifyContent={'center'} alignItems="center" width={size} height={size}>
            <StreakImage streak={streak} image={image} alternativeText={alternativeText} size={size} isRecord={isRecord} />
        </VStack>
    );
};

export default StreakImageContainer;

export { StreakImageSize };
