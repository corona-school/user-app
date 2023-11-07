import { Box, Progress, Stack, Text } from 'native-base';
import { useTranslation } from 'react-i18next';

type IndicatorBarProps = {
    maxSteps: number;
    currentStep?: number;
    isMobile?: boolean;
    centerText?: boolean;
};

const IndicatorBar: React.FC<IndicatorBarProps> = ({ maxSteps, currentStep, isMobile, centerText }) => {
    const { t } = useTranslation();
    const progress = currentStep ? (currentStep / maxSteps) * 100 : 0;
    return (
        <Stack direction={isMobile ? 'row' : 'column'} alignItems={isMobile ? 'center' : 'left'} space={isMobile ? 1 : 0}>
            <Box width={isMobile ? '90%' : '100%'}>
                <Progress bg="gray.100" value={progress} />
            </Box>
            <Text
                width={centerText ? '100%' : 'fit-content'}
                textAlign={centerText ? 'center' : 'right'}
                fontSize={centerText ? 'md' : 'xs'}
                color="primary.500"
                height="fit-content"
            >
                {isMobile
                    ? `${t('achievement.card.finishedStepsInformationMobile', { currentStep, maxSteps })}`
                    : `${t('achievement.card.finishedStepsInformation', { currentStep, maxSteps })}`}
            </Text>
        </Stack>
    );
};

export default IndicatorBar;
