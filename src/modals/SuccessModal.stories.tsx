import { SuccessModal } from './SuccessModal';
import { Box } from 'native-base';

export default {
    title: 'Molecules/SuccessModal',
    component: SuccessModal,
};

export const Base = {
    render: () => (
        <Box bgColor="primary.900">
            <SuccessModal title="Title" content="Content" />
        </Box>
    ),

    name: 'SuccessModal',
};
