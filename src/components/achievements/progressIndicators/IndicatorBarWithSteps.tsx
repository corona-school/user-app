import { Box, Progress, Stack, useBreakpointValue } from 'native-base';
import IndicatorStep from './IndicatorStep';
import { AchievementState } from '../../../types/achievement';
import { Step } from '../../../gql/graphql';

type IndicatorBarWithStepsProps = {
    maxSteps: number;
    steps: Step[];
    achievementState?: AchievementState;
};

const IndicatorBarWithSteps: React.FC<IndicatorBarWithStepsProps> = ({ maxSteps, steps, achievementState }) => {
    const currentStep = steps ? steps.findIndex((step) => step.isActive) : undefined;
    const progress = achievementState === AchievementState.COMPLETED ? 100 : currentStep ? (100 / (maxSteps - 1)) * currentStep : 0;

    const width = useBreakpointValue({ base: '90%', md: '80%' });
    const left = useBreakpointValue({ base: 0, md: '10%' });
    const direction = useBreakpointValue({ base: 'row', md: 'column' });
    const alignItems = useBreakpointValue({ base: 'center', md: 'left' });
    const space = useBreakpointValue({ base: 1, md: 0 });
    return (
        <Stack width={width} left={left} direction={direction} alignItems={alignItems} justifyContent="center" space={space}>
            <Box>
                <Progress bg="gray.100" value={progress} />
            </Box>
            {steps.map((step, index) => (
                <IndicatorStep
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
