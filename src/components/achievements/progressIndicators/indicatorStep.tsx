import { Text, VStack } from 'native-base';
import Check from '../../../assets/icons/icon_check.svg';
import Theme from '../../../Theme';
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
    const textColor = achievementState === AchievementState.COMPLETED ? Theme.colors.white : Theme.colors.primary[900];
    console.log(step, maxSteps, description, achievementState, isActive, isInactive);
    return (
        <VStack width="0" position={'absolute'} left={`${offset}%`} display={'flex'} alignItems={'center'}>
            <VStack
                alignItems="center"
                justifyContent="center"
                width="20px"
                height="20px"
                borderRadius="50%"
                backgroundColor={achievementState !== AchievementState.COMPLETED && isInactive ? 'gray.100' : 'primary.500'}
                outlineStyle="solid"
                outlineColor="rgba(0, 169, 145, 0.2)"
                outlineWidth={isInactive ? '0' : '3px'}
            >
                {achievementState !== AchievementState.COMPLETED && (isActive || isInactive) ? (
                    <Text fontSize={'xs'} color={isInactive ? Theme.colors.gray[500] : Theme.colors.white}>
                        {step + 1}
                    </Text>
                ) : (
                    <Check />
                )}
            </VStack>
            <Text
                position={'absolute'}
                fontSize={'xs'}
                textAlign={'center'}
                top={'32px'}
                width={`calc(600px / ${maxSteps})`}
                maxWidth={'150px'}
                color={textColor}
            >
                {description}
            </Text>
        </VStack>
    );
};

export default IndicatorStep;
