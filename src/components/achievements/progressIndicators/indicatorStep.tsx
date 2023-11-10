import { Text, VStack } from 'native-base';
import Check from '../../../assets/icons/icon_check.svg';
import { AchievementState } from '../types';

type IndicatorStepProps = {
    step: number;
    maxSteps: number;
    description: string;
    achievementState?: AchievementState;
    isActive?: boolean;
    isInactive?: boolean;
};

const IndicatorStep: React.FC<IndicatorStepProps> = ({ step, maxSteps, description, achievementState, isActive, isInactive }) => {
    const offsetPerStep = 100 / (maxSteps - 1);
    const offset = offsetPerStep * step;
    const textColor = achievementState === AchievementState.COMPLETED ? 'white' : 'primary.900';
    return (
        <VStack
            width="fit-content"
            height="fit-content"
            position="absolute"
            justifyContent="center"
            left={`calc(${offset}% - 13px)`}
            display="flex"
            alignItems="center"
            borderColor={isActive ? 'rgba(0, 169, 145, 0.2)' : 'transparent'}
            borderWidth="3px"
            borderRadius="50%"
        >
            <VStack
                alignItems="center"
                justifyContent="center"
                width="20px"
                height="20px"
                borderColor="rgba(0, 169, 145, 0.2)"
                borderWidth={isActive ? '3px' : '0px'}
                borderRadius="50%"
                backgroundColor={achievementState !== AchievementState.COMPLETED && isInactive ? 'gray.100' : 'primary.500'}
            >
                {achievementState !== AchievementState.COMPLETED && (isActive || isInactive) ? (
                    <Text fontSize={'xs'} color={isInactive ? 'gray.500' : 'white'}>
                        {step + 1}
                    </Text>
                ) : (
                    <Check />
                )}
            </VStack>
            <Text position="absolute" fontSize="xs" textAlign="center" top="32px" width={`calc(600px / ${maxSteps})`} color={textColor}>
                {description}
            </Text>
        </VStack>
    );
};

export default IndicatorStep;
