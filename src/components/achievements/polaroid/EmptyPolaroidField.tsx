import { Box, PresenceTransition, useBreakpointValue } from 'native-base';
import PolaroidDefault from '../../../assets/images/achievements/Polaroid_Default.svg';
import { PolaroidImageSize } from '../../../types/achievement';

type EmptyPolaroidFieldProps = {
    isLarge?: boolean;
};

const EmptyPolaroidField: React.FC<EmptyPolaroidFieldProps> = ({ isLarge }) => {
    const size = useBreakpointValue({
        base: isLarge ? PolaroidImageSize.MEDIUM : PolaroidImageSize.SMALL,
        md: PolaroidImageSize.MEDIUM,
        lg: isLarge ? PolaroidImageSize.LARGE : PolaroidImageSize.MEDIUM,
    });
    const shadowWidth = useBreakpointValue({ base: 0.5, md: 1, lg: isLarge ? 2 : 1 });
    const shadowRadius = useBreakpointValue({ base: 3, md: 6, lg: isLarge ? 9 : 6 });
    const boxWidth = useBreakpointValue({ base: '46.5px', md: '136px', lg: isLarge ? '157.5px' : '136px' });
    const boxHeight = useBreakpointValue({ base: '62.75px', md: '183px', lg: isLarge ? '212.5px' : '183px' });
    const updatedSize = size === PolaroidImageSize.MEDIUM ? size : `calc(${size} * 0.75)`;
    return (
        <Box width={updatedSize} height={`calc(${updatedSize} * 1.35)`} position="relative">
            <Box position="absolute" width="100%">
                <PresenceTransition
                    initial={{
                        rotate: '5deg',
                    }}
                >
                    <Box width={boxWidth} height={boxHeight} backgroundColor="gray.100">
                        {/* <PolaroidDefault /> */}
                    </Box>
                </PresenceTransition>
            </Box>
            <Box position="absolute" width="100%">
                <PresenceTransition
                    initial={{
                        rotate: '-5deg',
                    }}
                >
                    <Box
                        style={{
                            shadowColor: '#D2D2D2',
                            shadowOffset: {
                                width: shadowWidth,
                                height: shadowWidth * 2,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: shadowRadius,
                        }}
                    >
                        <PolaroidDefault />
                    </Box>
                </PresenceTransition>
            </Box>
        </Box>
    );
};

export default EmptyPolaroidField;
