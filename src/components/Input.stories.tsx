// @ts-nocheck
import type { Meta, StoryObj } from '@storybook/react';
import Input from './Input';
import { FormControl } from 'native-base';

type Story = StoryObj<typeof Input>;
const meta: Meta<typeof Input> = {
    title: 'Atoms/Input',
    component: Input,
    argTypes: {
        placeholder: { control: 'text' },
        isDisabled: { control: 'boolean' },
    },
};

export const Base: Story = {
    name: 'Input',
    render: (props) => (
        <FormControl>
            <FormControl.Label>Input label</FormControl.Label>
            <Input {...props} width={200} />
            <FormControl.HelperText>Helper text</FormControl.HelperText>
        </FormControl>
    ),
};

export default meta;
