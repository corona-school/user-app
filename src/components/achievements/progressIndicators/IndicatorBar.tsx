import { Box, Progress, Stack, Text, useBreakpointValue } from 'native-base';
import { useTranslation } from 'react-i18next';
import { Achievement_Type_Enum } from '../../../gql/graphql';

type IndicatorBarProps = {
    progressDescription?: string;
    maxSteps: number;
    currentStep?: number;
    achievementType?: Achievement_Type_Enum;
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
    achievementType,
    centerText,
    fullWidth,
    largeText,
    smallText,
    bgDark,
    isCard,
}) => {
    const { t } = useTranslation();
    const progress = currentStep ? (currentStep / maxSteps) * 100 : 0;

    const flexDirection = useBreakpointValue({
        base: achievementType === Achievement_Type_Enum.Streak ? 'column' : 'row-reverse',
        md: achievementType === Achievement_Type_Enum.Streak ? 'column' : 'column-reverse',
    });
    const alignItems = useBreakpointValue({ base: 'center', md: centerText ? 'center' : 'left' });
    const space = useBreakpointValue({ base: 1, md: 1 });
    const textWidth = useBreakpointValue({ base: achievementType === Achievement_Type_Enum.Streak ? '100%' : '20%', md: centerText ? '100%' : 'fit-content' });
    const alignText = useBreakpointValue({ base: 'right', md: centerText ? 'center' : 'left' });
    const finishedStepsInformation = useBreakpointValue({
        base: `${currentStep}/${maxSteps}`,
        md: `${t('achievement.card.finishedStepsInformation', { currentStep, maxSteps })}`,
    });
    const progressBarWidth = useBreakpointValue({
        base: fullWidth || largeText ? '100%' : '80%',
        md: fullWidth ? '100%' : '80%',
    });
    const fontSize = achievementType === Achievement_Type_Enum.Streak ? (largeText ? '14px' : '10px') : centerText ? '12px' : '14px';
    const numberOfLines = useBreakpointValue({ base: 1, md: 2 });
    return (
        <Stack direction={flexDirection} alignItems={alignItems} space={space} width="100%" height="fit-content">
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
                {(achievementType !== Achievement_Type_Enum.Streak && isCard) || !progressDescription ? `${finishedStepsInformation}` : progressDescription}
            </Text>
            <Box width={progressBarWidth} height="fit-content">
                <Progress bg={bgDark ? '#60787D' : 'gray.100'} value={progress} />
            </Box>
        </Stack>
    );
};

export default IndicatorBar;
