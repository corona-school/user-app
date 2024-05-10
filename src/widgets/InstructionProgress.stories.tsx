import { useState } from 'react';
import InstructionProgress from './InstructionProgress';

export default {
    title: 'Molecules/InstructionProgress',
    component: InstructionProgress,
};

const RenderBase = () => {
    const [index, setIndex] = useState(0);
    return (
        <InstructionProgress
            currentIndex={index}
            instructions={[{ label: 'First step' }, { label: 'Second step' }, { label: 'Third step' }, { label: 'Last step!' }]}
            goToStep={setIndex}
            canPressSteps
        />
    );
};

export const Base = {
    render: () => <RenderBase />,

    name: 'InstructionProgress',
};
