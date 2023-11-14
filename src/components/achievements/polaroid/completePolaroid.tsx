import { Box, Image, VStack, useBreakpointValue } from 'native-base';
import { PolaroidImageSize } from '../types';

type CompletePolaroidProps = {
    image: string;
    alternativeText: string;
    isLarge?: boolean;
};

const CompletePolaroid: React.FC<CompletePolaroidProps> = ({ image, alternativeText, isLarge }) => {
    const size = useBreakpointValue({
        base: isLarge ? PolaroidImageSize.MEDIUM : PolaroidImageSize.SMALL,
        md: PolaroidImageSize.MEDIUM,
        lg: isLarge ? PolaroidImageSize.LARGE : PolaroidImageSize.MEDIUM,
    });
    const polaroidOffset = useBreakpointValue({ base: isLarge ? '-20px' : 'opx', md: '-20px', lg: isLarge ? '-40px' : '-20px' });
    const polaroidBorderRadius = useBreakpointValue({ base: isLarge ? '3px' : '2px', md: '3px', lg: isLarge ? '4px' : '3px' });
    const shadow = useBreakpointValue({ base: 3, md: 5, lg: 9 });
    return (
        <VStack
            justifyContent="flex-start"
            alignItems="center"
            shadow={shadow}
            backgroundColor="white"
            width={size}
            height={`calc(${size} * 1.35)`}
            borderRadius={polaroidBorderRadius}
            paddingTop={`calc(${polaroidBorderRadius} * 2)`}
            top={polaroidOffset}
        >
            <Box width={`calc(${size} * 0.9)`} height={`calc((${size} * 1.35)* 0.75)`} borderRadius={polaroidBorderRadius} overflow={'hidden'}>
                <Image width="100%" height="100%" src={image} alt={alternativeText} />
            </Box>
        </VStack>
    );
};

export default CompletePolaroid;
