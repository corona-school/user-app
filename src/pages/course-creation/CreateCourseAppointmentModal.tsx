import { Modal } from 'native-base';
import React from 'react';
import AppointmentCreation from '../create-appointment/AppointmentCreation';

type ModalProps = {
    closeModal: () => void;
};
const CreateCourseAppointmentModal: React.FC<ModalProps> = ({ closeModal }) => {
    return (
        <>
            <Modal.Content minW="80%" marginX="auto" p={5}>
                <Modal.CloseButton />
                <Modal.Body>
                    <AppointmentCreation isCourseCreation={true} back={closeModal} closeModal={closeModal} />
                </Modal.Body>
            </Modal.Content>
        </>
    );
};

export default CreateCourseAppointmentModal;
