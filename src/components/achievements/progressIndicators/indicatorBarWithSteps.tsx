import { Box } from 'native-base';
import IndicatorStep from './indicatorStep';
import Theme from '../../../Theme';
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
    const progressBarWidth = achievementState === AchievementState.COMPLETED ? '100%' : `${offsetPerStep * currentStep! - offsetPerStep / 2}%`;
    return (
        <Box>
            <Box alignItems={'left'} height={'2px'} width={isMobile ? '90%' : '100%'} backgroundColor={Theme.colors.gray[300]} borderRadius={'1px'} top={'9px'}>
                {currentStep || achievementState === AchievementState.COMPLETED ? (
                    <Box height={'2px'} width={progressBarWidth} backgroundColor={Theme.colors.primary[500]} borderRadius={'1px'} />
                ) : (
                    <Box />
                )}
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
        </Box>
    );
};

export default IndicatorBarWithSteps;
