import type { Meta, StoryObj } from '@storybook/react';
import Text from './Text';
import { VStack } from 'native-base';

type Story = StoryObj<typeof Text>;
const meta: Meta<typeof Text> = {
    title: 'Atoms/Text',
    component: Text,
    argTypes: {
        children: {
            control: 'text',
        },
        fontWeight: {
            control: 'radio',
            options: ['light', 'bold', 'black', 'hairline', 'thin', 'normal', 'medium', 'semibold', 'extrabold', 'extraBlack'],
        },
    },
};

export const Base: Story = {
    name: 'Text',
    args: {
        fontWeight: 'normal',
    },
    render: (props) => (
        <VStack space={1}>
            <Text fontSize="xs" {...props}>
                {props.children || 'Text'} {'(xs)'}
            </Text>
            <Text fontSize="sm" {...props}>
                {props.children || 'Text'} {'(sm)'}
            </Text>
            <Text fontSize="md" {...props}>
                {props.children || 'Text'} {'(md)'}
            </Text>
            <Text fontSize="lg" {...props}>
                {props.children || 'Text'} {'(lg)'}
            </Text>
            <Text fontSize="xl" {...props}>
                {props.children || 'Text'} {'(xl)'}
            </Text>
            <Text fontSize="2xl" {...props}>
                {props.children || 'Text'} {'(2xl)'}
            </Text>{' '}
            <Text fontSize="3xl" {...props}>
                {props.children || 'Text'} {'(3xl)'}
            </Text>
            <Text fontSize="4xl" {...props}>
                {props.children || 'Text'} {'(4xl)'}
            </Text>
            <Text fontSize="5xl" {...props}>
                {props.children || 'Text'} {'(5xl)'}
            </Text>
            <Text fontSize="6xl" {...props}>
                {props.children || 'Text'} {'(6xl)'}
            </Text>
            <Text fontSize="7xl" {...props}>
                {props.children || 'Text'} {'(7xl)'}
            </Text>
            <Text fontSize="8xl" {...props}>
                {props.children || 'Text'} {'(8xl)'}
            </Text>
            <Text fontSize="9xl" {...props}>
                {props.children || 'Text'} {'(9xl)'}
            </Text>
        </VStack>
    ),
};

export default meta;
