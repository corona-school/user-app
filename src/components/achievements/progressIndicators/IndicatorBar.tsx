import { Box, Progress, Stack, Text, useBreakpointValue } from 'native-base';
import { useTranslation } from 'react-i18next';
import { Achievement_Type_Enum } from '../../../gql/graphql';

type IndicatorBarProps = {
    maxSteps: number;
    currentStep?: number;
    achievementType?: Achievement_Type_Enum;
    centerText?: boolean;
    largeText?: boolean;
    fullWidth?: boolean;
};

const IndicatorBar: React.FC<IndicatorBarProps> = ({ maxSteps, currentStep, achievementType, centerText, fullWidth, largeText }) => {
    const { t } = useTranslation();
    const progress = currentStep ? (currentStep / maxSteps) * 100 : 0;
    const leftSteps = currentStep ? maxSteps - currentStep : maxSteps;

    const flexDirection = useBreakpointValue({ base: achievementType === Achievement_Type_Enum.Streak ? 'column' : 'row-reverse', md: 'column-reverse' });
    const alignItems = useBreakpointValue({ base: 'center', md: centerText ? 'center' : 'left' });
    const space = useBreakpointValue({ base: 1, md: 1 });
    const textWidth = useBreakpointValue({ base: achievementType === Achievement_Type_Enum.Streak ? '100%' : '20%', md: centerText ? '100%' : 'fit-content' });
    const alignText = useBreakpointValue({ base: 'right', md: centerText ? 'center' : 'left' });
    const finishedStepsInformation = useBreakpointValue({
        base: `${t('achievement.card.finishedStepsInformationMobile', { currentStep, maxSteps })}`,
        md: `${t('achievement.card.finishedStepsInformation', { currentStep, maxSteps })}`,
    });
    const progressBarWidth = useBreakpointValue({
        base: fullWidth || largeText ? '100%' : '80%',
        md: fullWidth ? '100%' : '80%',
    });
    const fontSize = achievementType === Achievement_Type_Enum.Streak ? (largeText ? '14px' : '10px') : centerText ? '12px' : '14px';
    return (
        <Stack direction={flexDirection} alignItems={alignItems} space={space}>
            <Text
                width={textWidth}
                textAlign={alignText}
                fontSize={fontSize}
                color="primary.500"
                height="fit-content"
                numberOfLines={1}
                overflow="hidden"
                ellipsizeMode="tail"
            >
                {achievementType === Achievement_Type_Enum.Streak
                    ? `${leftSteps === 0 ? `${t('achievement.modal.record', { record: maxSteps })}` : `${t('achievement.modal.streak', { leftSteps })}`}`
                    : `${finishedStepsInformation}`}
            </Text>
            <Box width={progressBarWidth}>
                <Progress bg="gray.100" value={progress} />
            </Box>
        </Stack>
    );
};

export default IndicatorBar;
