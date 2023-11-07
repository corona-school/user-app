import { Box, Progress, Stack, Text } from 'native-base';
import { useTranslation } from 'react-i18next';

type IndicatorBarProps = {
    maxSteps: number;
    currentStep?: number;
    isMobile?: boolean;
};

const IndicatorBar: React.FC<IndicatorBarProps> = ({ maxSteps, currentStep, isMobile }) => {
    const { t } = useTranslation();
    const progress = currentStep ? (currentStep / maxSteps) * 100 : 0;
    return (
        <Stack direction={isMobile ? 'row' : 'column'} alignItems={isMobile ? 'center' : 'left'} space={isMobile ? 1 : 0}>
            <Box width={isMobile ? '90%' : '100%'}>
                <Progress value={progress} />
            </Box>
            <Text fontSize="xs" color="primary.500" height="fit-content" width="fit-content">
                {isMobile
                    ? `${t('achievement.card.finishedStepsInformationMobile', { currentStep, maxSteps })}`
                    : `${t('achievement.card.finishedStepsInformation', { currentStep, maxSteps })}`}
            </Text>
        </Stack>
    );
};

export default IndicatorBar;
