import { Box, Progress, Stack, Text } from 'native-base';
import { useTranslation } from 'react-i18next';
import { AchievementType } from '../types';

type IndicatorBarProps = {
    maxSteps: number;
    currentStep?: number;
    achievementType?: AchievementType;
    isMobile?: boolean;
    centerText?: boolean;
    largeText?: boolean;
};

const IndicatorBar: React.FC<IndicatorBarProps> = ({ maxSteps, currentStep, achievementType, isMobile, centerText, largeText }) => {
    const { t } = useTranslation();
    const progress = currentStep ? (currentStep / maxSteps) * 100 : 0;
    const leftSteps = currentStep ? maxSteps - currentStep : maxSteps;
    return (
        <Stack direction={isMobile ? 'row' : 'column'} alignItems={isMobile ? 'center' : 'left'} space={isMobile ? 1 : 0}>
            <Box width={isMobile ? '90%' : '100%'}>
                <Progress bg="gray.100" value={progress} />
            </Box>
            <Text
                width={centerText ? '100%' : 'fit-content'}
                textAlign={centerText ? 'center' : 'right'}
                fontSize={centerText ? 'xs' : 'xs'}
                color="primary.500"
                height="fit-content"
            >
                {achievementType === AchievementType.STREAK
                    ? `${leftSteps === 0 ? `${t('achievement.modal.record', { record: maxSteps })}` : `${t('achievement.modal.streak', { leftSteps })}`}`
                    : `${
                          isMobile
                              ? `${t('achievement.card.finishedStepsInformationMobile', { currentStep, maxSteps })}`
                              : `${t('achievement.card.finishedStepsInformation', { currentStep, maxSteps })}`
                      }`}
            </Text>
        </Stack>
    );
};

export default IndicatorBar;
