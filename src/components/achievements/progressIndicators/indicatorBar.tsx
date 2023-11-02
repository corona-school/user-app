import { Box, Stack, Text } from 'native-base';
import Theme from '../../../Theme';
import { useTranslation } from 'react-i18next';

type IndicatorBarProps = {
    maxSteps: number;
    currentStep?: number;
};

const IndicatorBar: React.FC<IndicatorBarProps> = ({ maxSteps, currentStep }) => {
    const { t } = useTranslation();
    return (
        <Stack>
            <Box alignItems={'left'} height={'8px'} width={'100%'} backgroundColor={Theme.colors.gray[300]} borderRadius={'4px'}>
                {currentStep ? (
                    <Box height={'8px'} width={`${(currentStep / maxSteps) * 100}%`} backgroundColor={Theme.colors.primary[500]} borderRadius={'4px'} />
                ) : (
                    <Box />
                )}
            </Box>
            <Text fontSize={'xs'} color={Theme.colors.primary[500]} height={'fit-content'} width={'fit-content'}>
                {`${t('achievement.card.finishedStepsInformation', { currentStep, maxSteps })}`}
            </Text>
        </Stack>
    );
};

export default IndicatorBar;
