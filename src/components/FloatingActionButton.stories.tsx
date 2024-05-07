import { Meta, StoryObj } from '@storybook/react';
import FloatingActionButton from './FloatingActionButton';

const meta: Meta<typeof FloatingActionButton> = {
    title: 'Atoms/FloatingActionButton',
    component: FloatingActionButton,
};

type Story = StoryObj<typeof FloatingActionButton>;
export const Base: Story = {
    render: () => <FloatingActionButton handlePress={() => console.log('Add new appointment')} place={'top-left'} />,
    name: 'FloatingActionButton',
};

export default meta;
