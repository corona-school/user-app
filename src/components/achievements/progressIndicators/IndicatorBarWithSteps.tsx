import { Box, Progress, Stack, useBreakpointValue } from 'native-base';
import IndicatorStep from './IndicatorStep';
import { Achievement_State, Step } from '../../../gql/graphql';

type IndicatorBarWithStepsProps = {
    maxSteps: number;
    steps: Step[];
    achievementState?: Achievement_State;
};

const IndicatorBarWithSteps: React.FC<IndicatorBarWithStepsProps> = ({ maxSteps, steps, achievementState }) => {
    // If we can't find any active step, we'll show all of them as inactive
    const currentStep = steps ? steps.findIndex((step) => step.isActive) : -1;
    const progress = achievementState === Achievement_State.Completed ? 100 : currentStep >= 0 ? (100 / (maxSteps - 1)) * (currentStep - 1) : 0;

    const width = useBreakpointValue({ base: '90%', md: '80%' });
    const left = useBreakpointValue({ base: 0, md: '10%' });
    const direction = useBreakpointValue({ base: 'row', md: 'column' });
    const alignItems = useBreakpointValue({ base: 'center', md: 'left' });
    const space = useBreakpointValue({ base: 1, md: 0 });
    return (
        <Stack width={width} left={left} direction={direction} alignItems={alignItems} justifyContent="center" space={space} height="fit-content">
            <Box position="absolute" height="8px" width="100%" top="8px">
                <Progress bg="gray.100" value={progress} />
            </Box>
            <Box height="52px">
                {steps.map((step, index) => (
                    <IndicatorStep
                        step={index}
                        maxSteps={steps.length}
                        name={step.name}
                        isActive={step.isActive}
                        isInactive={index > currentStep}
                        achievementState={achievementState}
                    />
                ))}
            </Box>
        </Stack>
    );
};

export default IndicatorBarWithSteps;
