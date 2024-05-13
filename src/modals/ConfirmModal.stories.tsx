import { Box, Button } from 'native-base';
import { ConfirmModal } from './ConfirmModal';
import { useState } from 'react';

export default {
    title: 'Molecules/ConfirmModal',
    component: ConfirmModal,
};

const RenderBase = () => {
    const [open, setOpen] = useState(false);

    return (
        <Box h="400">
            <Button width={200} onPress={() => setOpen(true)}>
                Maintain Storybook
            </Button>
            <ConfirmModal text="Do you really want to maintain Storybook?" isOpen={open} onClose={() => setOpen(false)} onConfirmed={() => setOpen(false)} />
        </Box>
    );
};

export const Base = {
    render: () => <RenderBase />,

    name: 'ConfirmModal',
};

const RenderConfirmModalDanger = () => {
    const [open, setOpen] = useState(false);

    return (
        <Box h="400">
            <Button width={200} onPress={() => setOpen(true)}>
                Maintain Storybook
            </Button>
            <ConfirmModal
                danger
                text="Do you really want to maintain Storybook?"
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirmed={() => setOpen(false)}
            />
        </Box>
    );
};

export const ConfirmModalDanger = {
    render: () => <RenderConfirmModalDanger />,

    name: 'ConfirmModal / danger',
};
