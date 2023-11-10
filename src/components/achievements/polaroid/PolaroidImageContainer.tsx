import { Box, PresenceTransition } from 'native-base';
import CompletePolaroid from './CompletePolaroid';
import EmptyPolaroidField from './EmptyPolaroidField';

type PolaroidImageContainerProps = {
    image: string | undefined;
    alternativeText: string;
    isMobile?: boolean;
};

const PolaroidImageContainer: React.FC<PolaroidImageContainerProps> = ({ image, alternativeText, isMobile }) => {
    return (
        <Box display="flex">
            {image ? (
                <PresenceTransition
                    initial={{
                        rotate: '-5deg',
                        translateY: isMobile ? 0 : -20,
                    }}
                >
                    <CompletePolaroid image={image} alternativeText={alternativeText} isMobile={isMobile} />
                </PresenceTransition>
            ) : (
                <EmptyPolaroidField isMobile={isMobile} />
            )}
        </Box>
    );
};

export default PolaroidImageContainer;
