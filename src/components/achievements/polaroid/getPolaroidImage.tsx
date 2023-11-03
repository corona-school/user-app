import { Box, PresenceTransition } from 'native-base';
import CompletePolaroid from './completePolaroid';
import EmptyPolaroidField from './emptyPolaroidField';

type PolaroidImageContainerProps = {
    image: string | undefined;
    alternativeText: string;
    isMobile?: boolean;
    isLarge?: boolean;
};

const PolaroidImageContainer: React.FC<PolaroidImageContainerProps> = ({ image, alternativeText, isMobile, isLarge }) => {
    return (
        <Box display={'flex'}>
            {image ? (
                <PresenceTransition
                    initial={{
                        rotate: '-5deg',
                        translateY: isMobile ? 0 : -20,
                        scale: isLarge ? 1.5 : 1,
                    }}
                >
                    <CompletePolaroid image={image} alternativeText={alternativeText} isMobile={isMobile} />
                </PresenceTransition>
            ) : (
                <PresenceTransition
                    initial={{
                        translateY: isLarge ? 75 : isMobile ? 0 : 20,
                        scale: isLarge ? 1.5 : 1,
                    }}
                >
                    <EmptyPolaroidField isMobile={isMobile} />
                </PresenceTransition>
            )}
        </Box>
    );
};

export default PolaroidImageContainer;
