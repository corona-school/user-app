import { Box, Image, VStack } from 'native-base';

type CompletePolaroidProps = {
    image: string;
    alternativeText: string;
    isMobile?: boolean;
};

const CompletePolaroid: React.FC<CompletePolaroidProps> = ({ image, alternativeText, isMobile }) => {
    return (
        <VStack
            justifyContent="flex-start"
            alignItems="center"
            shadow="0px 2px 4px 0px rgba(0, 0, 0, 0.25)"
            backgroundColor="white"
            width={isMobile ? '60px' : '136px'}
            height={isMobile ? '80px' : '184px'}
            borderRadius={isMobile ? '2px' : '4px'}
            paddingTop={isMobile ? '4px' : '7.5px'}
        >
            <Box
                width={isMobile ? '52px' : '120px'}
                height={isMobile ? '62px' : '144px'}
                borderRadius={isMobile ? '1px' : '2px'}
                overflow={isMobile ? 'hidden' : 'visible'}
            >
                <Image width="100%" height="100%" src={image} alt={alternativeText} />
            </Box>
        </VStack>
    );
};

export default CompletePolaroid;
