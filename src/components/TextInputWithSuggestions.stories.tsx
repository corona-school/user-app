import { useState } from 'react';
import { TextInputWithSuggestions } from './TextInputWithSuggestions';

export default {
    title: 'Molecules/TextInputWithSuggestions',
    component: TextInputWithSuggestions,
};

const Render = () => {
    const [value, setValue] = useState('');

    return <TextInputWithSuggestions value={value} setValue={setValue} suggestions={['A suggestion', 'And another one']} />;
};

export const Base = {
    render: () => <Render />,

    name: 'TextInputWithSuggestions',
};
