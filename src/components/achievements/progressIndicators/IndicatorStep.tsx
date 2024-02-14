import { Box, Text, VStack } from 'native-base';
import Check from '../../../assets/icons/icon_check.svg';
import { Achievement_State, Maybe } from '../../../gql/graphql';

type IndicatorStepProps = {
    step: number;
    maxSteps: number;
    name: string;
    achievementState?: Achievement_State;
    isActive?: Maybe<boolean> | undefined;
    isInactive?: boolean;
};

const IndicatorStep: React.FC<IndicatorStepProps> = ({ step, maxSteps, name, achievementState, isActive, isInactive }) => {
    const offsetPerStep = 100 / (maxSteps - 1);
    const offset = offsetPerStep * step;
    const textColor = achievementState === Achievement_State.Completed ? 'white' : 'primary.900';
    return (
        <VStack
            width="fit-content"
            height="fit-content"
            position="absolute"
            justifyContent="center"
            left={`calc(${offset}% - 13px)`}
            display="flex"
            alignItems="center"
        >
            <Box width="fit-content" height="52">
                <VStack borderWidth="3px" borderRadius="50%" borderColor={isActive ? 'rgba(0, 169, 145, 0.2)' : 'transparent'}>
                    <VStack
                        alignItems="center"
                        justifyContent="center"
                        width="20px"
                        height="20px"
                        borderRadius="50%"
                        backgroundColor={achievementState !== Achievement_State.Completed && isInactive ? 'gray.100' : 'primary.500'}
                    >
                        {achievementState !== Achievement_State.Completed && (isActive || isInactive) ? (
                            <Text fontSize="12px" color={isInactive ? 'gray.500' : 'white'}>
                                {step + 1}
                            </Text>
                        ) : (
                            <Check />
                        )}
                    </VStack>
                </VStack>
            </Box>
            <Text position="absolute" fontSize="12px" textAlign="center" top="32px" width={`calc(600px / ${maxSteps})`} color={textColor}>
                {name}
            </Text>
        </VStack>
    );
};

export default IndicatorStep;
