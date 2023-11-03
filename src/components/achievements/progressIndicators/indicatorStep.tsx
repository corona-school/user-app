import { Box, Text } from 'native-base';
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
    const offsetPerStep = 100 / maxSteps;
    const offset = offsetPerStep * (step + 1) - offsetPerStep / 2;
    const textColor = achievementState === AchievementState.COMPLETED ? Theme.colors.white : Theme.colors.primary[900];
    return (
        <Box position={'absolute'} left={`${offset}%`} display={'flex'} flexDirection={'column'} alignItems={'center'}>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: achievementState !== AchievementState.COMPLETED && isInactive ? Theme.colors.gray[100] : Theme.colors.primary[500],
                    outline: isActive ? `3px solid rgba(0, 169, 145, 0.2)` : 'none',
                }}
            >
                {achievementState !== AchievementState.COMPLETED && (isActive || isInactive) ? (
                    <Text fontSize={'xs'} color={isInactive ? Theme.colors.gray[500] : Theme.colors.white}>
                        {step + 1}
                    </Text>
                ) : (
                    <Check />
                )}
            </div>
            <Text position={'absolute'} fontSize={'xs'} textAlign={'center'} top={'32px'} width={`calc(600px / ${maxSteps})`} color={textColor}>
                {description}
            </Text>
        </Box>
    );
};

export default IndicatorStep;
