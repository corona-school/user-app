import IndicatorStep from './IndicatorStep';

const meta = {
    title: 'Organisms/Achievements/ProgressIndicators/IndicatorStep',
    component: IndicatorStep,
};

export default meta;

export const Base = {
    render: () => <IndicatorStep name="step" maxSteps={5} step={2} />,
    name: 'Indicator Step',
};

export const IndicatorStepActive = {
    render: () => <IndicatorStep name="step" maxSteps={5} step={2} isActive />,
    name: 'Indicator Step Active',
};

export const IndicatorStepInactive = {
    render: () => <IndicatorStep name="step" maxSteps={5} step={2} isActive={false} />,
    name: 'Indicator Step Inactive',
};
