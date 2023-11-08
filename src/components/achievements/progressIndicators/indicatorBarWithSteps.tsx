import { Box, Progress, Stack } from 'native-base';
import IndicatorStep from './IndicatorStep';
import { AchievementState } from '../types';

type IndicatorBarWithStepsProps = {
    maxSteps: number;
    steps: {
        description: string;
        isActive?: boolean;
    }[];
    isMobile?: boolean;
    achievementState?: AchievementState;
};

const IndicatorBarWithSteps: React.FC<IndicatorBarWithStepsProps> = ({ maxSteps, steps, isMobile, achievementState }) => {
    const offsetPerStep = 100 / maxSteps;
    const currentStep = steps ? steps.findIndex((step) => step.isActive) + 1 : undefined;
    const progress = achievementState === AchievementState.COMPLETED ? 100 : currentStep ? offsetPerStep * currentStep - offsetPerStep / 2 + 1 : 0;
    return (
        <Stack direction={isMobile ? 'row' : 'column'} alignItems={isMobile ? 'center' : 'left'} justifyContent="center" space={isMobile ? 1 : 0}>
            <Box width={isMobile ? '90%' : '100%'}>
                <Progress bg="gray.100" value={progress} />
            </Box>
            {steps.map((step, index) => (
                <IndicatorStep
                    key={index}
                    step={index}
                    maxSteps={steps.length}
                    description={step.description}
                    isActive={step.isActive}
                    isInactive={index >= currentStep!}
                    achievementState={achievementState}
                />
            ))}
        </Stack>
    );
};

export default IndicatorBarWithSteps;
