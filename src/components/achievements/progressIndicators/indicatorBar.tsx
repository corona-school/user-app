import { Box, Stack, Text } from 'native-base';
import Theme from '../../../Theme';
import { useTranslation } from 'react-i18next';

type IndicatorBarProps = {
    maxSteps: number;
    currentStep?: number;
    isMobile?: boolean;
    centerText?: boolean;
};

const IndicatorBar: React.FC<IndicatorBarProps> = ({ maxSteps, currentStep, isMobile, centerText }) => {
    const { t } = useTranslation();
    return (
        <Stack direction={isMobile ? 'row' : 'column'} alignItems={isMobile ? 'center' : 'left'} space={isMobile ? 1 : 0}>
            <Box alignItems={'left'} height={'8px'} width={isMobile ? '90%' : '100%'} backgroundColor={Theme.colors.gray[300]} borderRadius={'4px'}>
                {currentStep ? (
                    <Box height={'8px'} width={`${(currentStep / maxSteps) * 100}%`} backgroundColor={Theme.colors.primary[500]} borderRadius={'4px'} />
                ) : (
                    <Box />
                )}
            </Box>
            <Text
                width={centerText ? '100%' : 'fit-content'}
                textAlign={centerText ? 'center' : 'right'}
                fontSize={centerText ? 'md' : 'xs'}
                color={Theme.colors.primary[500]}
                height={'fit-content'}
            >
                {isMobile
                    ? `${t('achievement.card.finishedStepsInformationMobile', { currentStep, maxSteps })}`
                    : `${t('achievement.card.finishedStepsInformation', { currentStep, maxSteps })}`}
            </Text>
        </Stack>
    );
};

export default IndicatorBar;
