import type { Meta, StoryObj } from '@storybook/react';
import Button from './Button';

type Story = StoryObj<typeof Button>;
const meta: Meta<typeof Button> = {
    title: 'Atoms/Button',
    component: Button,
    argTypes: {
        variant: {
            options: ['secondary', 'outlinelight', 'solid', 'outline', 'link', 'ghost', 'subtle', 'unstyled'],
            control: 'radio',
        },
        isDisabled: {
            control: 'boolean',
        },
        isLoading: {
            control: 'boolean',
        },
        label: {
            control: 'text',
        },
    },
};

export const Base: Story = {
    name: 'Button',
    render: (props) => (
        <Button {...props} variant={props.variant || 'solid'} width={200}>
            {props.label || 'Button'}
        </Button>
    ),
};

export default meta;
