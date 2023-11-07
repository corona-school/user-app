import { PresenceTransition, VStack } from 'native-base';
import CompletePolaroid from './CompletePolaroid';
import EmptyPolaroidField from './EmptyPolaroidField';

type PolaroidImageContainerProps = {
    image: string | undefined;
    alternativeText: string;
    isMobile?: boolean;
    isLarge?: boolean;
};

const PolaroidImageContainer: React.FC<PolaroidImageContainerProps> = ({ image, alternativeText, isMobile, isLarge }) => {
    return (
        <VStack alignItems="center">
            {image ? (
                <PresenceTransition
                    initial={{
                        rotate: '-5deg',
                        translateY: isMobile ? 0 : -15,
                        scale: isLarge ? 1.5 : 1,
                    }}
                >
                    <CompletePolaroid image={image} alternativeText={alternativeText} isMobile={isMobile} />
                </PresenceTransition>
            ) : (
                <PresenceTransition
                    initial={{
                        translateY: isLarge ? 25 : 0,
                        scale: isLarge ? 1.5 : 1,
                    }}
                >
                    <EmptyPolaroidField isMobile={isMobile} />
                </PresenceTransition>
            )}
        </VStack>
    );
};

export default PolaroidImageContainer;
