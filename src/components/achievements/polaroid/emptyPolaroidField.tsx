import { Box, PresenceTransition, useBreakpointValue } from 'native-base';
import PolaroidDefault from '../../../assets/images/achievements/Polaroid_Default.svg';
import { PolaroidImageSize } from '../types';

type EmptyPolaroidFieldProps = {
    size: PolaroidImageSize;
};

const EmptyPolaroidField: React.FC<EmptyPolaroidFieldProps> = ({ size }) => {
    const shadow = useBreakpointValue({ base: 3, md: 5, lg: 9 });
    const updatedSize = size === PolaroidImageSize.MEDIUM ? size : `calc(${size} * 0.85)`;
    return (
        <Box width={updatedSize} height={`calc(${updatedSize} * 1.35)`} position="relative">
            <Box position="absolute" width="100%">
                <PresenceTransition
                    initial={{
                        rotate: '5deg',
                    }}
                >
                    <Box shadow={shadow}>
                        <PolaroidDefault />
                    </Box>
                </PresenceTransition>
            </Box>
            <Box position="absolute" width="100%">
                <PresenceTransition
                    initial={{
                        rotate: '-5deg',
                    }}
                >
                    <Box shadow={shadow}>
                        <PolaroidDefault />
                    </Box>
                </PresenceTransition>
            </Box>
        </Box>
    );
};

export default EmptyPolaroidField;
