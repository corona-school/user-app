import { Box, CloseIcon, Modal } from 'native-base';
import React from 'react';

const ParticipantsModal = () => {
    return (
        <Modal isOpen mt="100">
            <Modal.Content width="350" marginX="auto" backgroundColor="transparent">
                <Box position="absolute" zIndex="1" right="20px" top="14px">
                    <CloseIcon color="white" />
                </Box>
                <Modal.Body background="primary.900">TEST</Modal.Body>
            </Modal.Content>
        </Modal>
    );
};

export default ParticipantsModal;
