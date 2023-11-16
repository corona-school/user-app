import { Box, Progress, Stack, Text, useBreakpointValue } from 'native-base';
import { useTranslation } from 'react-i18next';
import { AchievementType } from '../../../types/achievement';

type IndicatorBarProps = {
    maxSteps: number;
    currentStep?: number;
    achievementType?: AchievementType;
    centerText?: boolean;
    largeText?: boolean;
    fullWidth?: boolean;
};

const IndicatorBar: React.FC<IndicatorBarProps> = ({ maxSteps, currentStep, achievementType, centerText, fullWidth }) => {
    const { t } = useTranslation();
    const progress = currentStep ? (currentStep / maxSteps) * 100 : 0;
    const leftSteps = currentStep ? maxSteps - currentStep : maxSteps;

    const flexDirection = useBreakpointValue({ base: achievementType === AchievementType.STREAK ? 'column' : 'row-reverse', md: 'column-reverse' });
    const alignItems = useBreakpointValue({ base: 'center', md: centerText ? 'center' : 'left' });
    const space = useBreakpointValue({ base: 1, md: 0 });
    const textWidth = useBreakpointValue({ base: achievementType === AchievementType.STREAK ? '100%' : '20%', md: centerText ? '100%' : 'fit-content' });
    const alignText = useBreakpointValue({ base: 'right', md: centerText ? 'center' : 'left' });
    const finishedStepsInformation = useBreakpointValue({
        base: `${t('achievement.card.finishedStepsInformationMobile', { currentStep, maxSteps })}`,
        md: `${t('achievement.card.finishedStepsInformation', { currentStep, maxSteps })}`,
    });
    const progressBarWidth = useBreakpointValue({
        base: fullWidth || achievementType === AchievementType.STREAK ? '100%' : '80%',
        md: fullWidth ? '100%' : '80%',
    });
    return (
        <Stack direction={flexDirection} alignItems={alignItems} space={space}>
            <Text width={textWidth} textAlign={alignText} fontSize={centerText ? 'xs' : 'xs'} color="primary.500" height="fit-content" numberOfLines={1}>
                {achievementType === AchievementType.STREAK
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
