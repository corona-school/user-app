import { Box, Image, VStack, useBreakpointValue } from 'native-base';
import { PolaroidImageSize } from '../types';
import { getPolaroidBorderRadius, getPolaroidOffset } from '../helpers/achievement-image-helper';

type CompletePolaroidProps = {
    image: string;
    alternativeText: string;
    size: PolaroidImageSize;
};

const CompletePolaroid: React.FC<CompletePolaroidProps> = ({ image, alternativeText, size }) => {
    const shadow = useBreakpointValue({ base: 3, md: 5, lg: 9 });
    return (
        <VStack
            justifyContent="flex-start"
            alignItems="center"
            shadow={shadow}
            backgroundColor="white"
            width={size}
            height={`calc(${size} * 1.35)`}
            borderRadius={getPolaroidBorderRadius(size)}
            paddingTop={`calc(${getPolaroidBorderRadius(size)} * 2)`}
            top={getPolaroidOffset(size)}
        >
            <Box width={`calc(${size} * 0.9)`} height={`calc((${size} * 1.35)* 0.75)`} borderRadius={getPolaroidBorderRadius(size)} overflow={'hidden'}>
                <Image width="100%" height="100%" src={image} alt={alternativeText} />
            </Box>
        </VStack>
    );
};

export default CompletePolaroid;
