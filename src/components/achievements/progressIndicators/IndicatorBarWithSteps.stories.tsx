import IndicatorBarWithSteps from './IndicatorBarWithSteps';
import { Achievement_State } from '../../../gql/graphql';

const meta = {
    title: 'Organisms/Achievements/ProgressIndicators/IndicatorBarWithSteps',
    component: IndicatorBarWithSteps,
};

export default meta;

export const IndicatorBarWithStepsInactive = {
    render: () => (
        <IndicatorBarWithSteps
            maxSteps={4}
            steps={[
                {
                    name: 'Step 1',
                    isActive: false,
                },
                {
                    name: 'Step 2',
                    isActive: false,
                },
                {
                    name: 'Step 3',
                    isActive: false,
                },
                {
                    name: 'Step 4',
                    isActive: false,
                },
            ]}
            achievementState={Achievement_State.Inactive}
        />
    ),

    name: 'Indicator Bar With Steps Inactive',
};

export const Base = {
    render: () => (
        <IndicatorBarWithSteps
            maxSteps={4}
            steps={[
                {
                    name: 'Step 1',
                    isActive: false,
                },
                {
                    name: 'Step 2',
                    isActive: false,
                },
                {
                    name: 'Step 3',
                    isActive: true,
                },
                {
                    name: 'Step 4',
                    isActive: false,
                },
            ]}
        />
    ),

    name: 'Indicator Bar With Steps',
};

export const IndicatorBarWithStepsCompleted = {
    render: () => (
        <IndicatorBarWithSteps
            maxSteps={4}
            steps={[
                {
                    name: 'Step 1',
                    isActive: false,
                },
                {
                    name: 'Step 2',
                    isActive: false,
                },
                {
                    name: 'Step 3',
                    isActive: false,
                },
                {
                    name: 'Step 4',
                    isActive: false,
                },
            ]}
            achievementState={Achievement_State.Completed}
        />
    ),

    name: 'Indicator Bar With Steps Completed',
};
