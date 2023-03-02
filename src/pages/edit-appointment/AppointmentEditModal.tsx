import { Modal } from 'native-base';
import React from 'react';
import AppointmentEdit from './AppointmentEdit';

const AppointmentEditModal = () => {
    return (
        <>
            <Modal.Content minW="80%" marginX="auto" p={5}>
                <Modal.CloseButton />
                <Modal.Body>
                    <AppointmentEdit appointmentId={0} />
                </Modal.Body>
            </Modal.Content>
        </>
    );
};

export default AppointmentEditModal;
