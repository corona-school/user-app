import { Box, Progress, Stack, Text, useBreakpointValue } from 'native-base';

type IndicatorBarProps = {
    progressDescription?: string;
    maxSteps: number;
    currentStep?: number;
    centerText?: boolean;
    largeText?: boolean;
    smallText?: boolean;
    fullWidth?: boolean;
    bgDark?: boolean;
    isCard?: boolean;
};

const IndicatorBar: React.FC<IndicatorBarProps> = ({
    progressDescription,
    maxSteps,
    currentStep,
    centerText,
    fullWidth,
    largeText,
    smallText,
    bgDark,
    isCard,
}) => {
    const progress = currentStep ? (currentStep / maxSteps) * 100 : 0;

    const alignItems = useBreakpointValue({ base: 'center', md: centerText ? 'center' : 'left' });
    const space = useBreakpointValue({ base: 1, md: 1 });
    const textWidth = useBreakpointValue({
        base: '100%',
        md: centerText ? '100%' : 'fit-content',
    });
    const alignText = useBreakpointValue({ base: isCard ? 'left' : 'center', md: centerText ? 'center' : 'left' });
    const progressBarWidth = useBreakpointValue({
        base: fullWidth || largeText ? '100%' : '80%',
        md: fullWidth ? '100%' : '80%',
    });

    const fontSize = isCard ? '10px' : largeText ? '14px' : '12px';
    const numberOfLines = useBreakpointValue({ base: 1, md: 2 });
    return (
        <Stack alignItems={alignItems} space={space} width="100%" height="fit-content">
            <Box width={progressBarWidth} height="fit-content">
                <Progress bg={bgDark ? '#60787D' : 'gray.100'} value={progress} />
            </Box>
            <Text
                width={textWidth}
                textAlign={alignText}
                fontSize={smallText ? '12px' : fontSize}
                color="primary.500"
                height="fit-content"
                numberOfLines={numberOfLines}
                overflow="hidden"
                ellipsizeMode="tail"
            >
                {progressDescription ?? ''}
            </Text>
        </Stack>
    );
};

export default IndicatorBar;
