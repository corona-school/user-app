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

    // The percentage of each step in the progress bar
    const partSize = 100 / (maxSteps - 1);
    // How many parts of the progress bar should be filled
    // -0.5 to make the progress bar fill up to half of the current step
    let parts = currentStep - 0.5;
    // If the achievement is completed, we'll show the progress bar as full
    // To ensure that it's 100% full, we'll set the parts to the maxSteps, so that the result is always 100
    if (achievementState === Achievement_State.Completed) {
        parts = maxSteps;
    }
    const progress = partSize * parts;

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
                        isFutureStep={index > currentStep}
                        achievementState={achievementState}
                    />
                ))}
            </Box>
        </Stack>
    );
};

export default IndicatorBarWithSteps;
