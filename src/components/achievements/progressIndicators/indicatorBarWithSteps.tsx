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
    const currentStep = steps ? steps.findIndex((step) => step.isActive) : undefined;
    const progress = achievementState === AchievementState.COMPLETED ? 100 : currentStep ? (100 / (maxSteps - 1)) * currentStep + 1 : 0;
    return (
        <Stack
            width={isMobile ? '90%' : '80%'}
            left={isMobile ? 0 : '10%'}
            direction={isMobile ? 'row' : 'column'}
            alignItems={isMobile ? 'center' : 'left'}
            justifyContent="center"
            space={isMobile ? 1 : 0}
        >
            <Box>
                <Progress bg="gray.100" value={progress} />
            </Box>
            {steps.map((step, index) => (
                <IndicatorStep
                    key={index}
                    step={index}
                    maxSteps={steps.length}
                    description={step.description}
                    isActive={step.isActive}
                    isInactive={typeof currentStep === 'number' ? index > currentStep : true}
                    achievementState={achievementState}
                />
            ))}
        </Stack>
    );
};

export default IndicatorBarWithSteps;
