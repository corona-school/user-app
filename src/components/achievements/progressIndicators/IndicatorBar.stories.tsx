import { Meta } from '@storybook/react';
import IndicatorBar from './IndicatorBar';

const meta: Meta<typeof IndicatorBar> = {
    title: 'Organisms/Achievements/ProgressIndicators/IndicatorBar',
    component: IndicatorBar,
};

export default meta;

export const IndicatorBarBasic = {
    render: () => <IndicatorBar maxSteps={5} currentStep={2} />,
    name: 'Indicator Bar',
};
