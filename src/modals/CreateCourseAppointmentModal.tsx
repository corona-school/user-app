import { Modal } from 'native-base';
import React from 'react';
import AppointmentCreation from '../pages/create-appointment/AppointmentCreation';
import { useLayoutHelper } from '../hooks/useLayoutHelper';

type ModalProps = {
    total: number;
    closeModal: () => void;
};
const CreateCourseAppointmentModal: React.FC<ModalProps> = ({ closeModal, total }) => {
    const { isMobile } = useLayoutHelper();
    return (
        <>
            <Modal.Content minW="90%" p={isMobile ? 3 : 10}>
                <Modal.CloseButton />
                <Modal.Body>
                    <AppointmentCreation appointmentsTotal={total} isCourseCreation={true} back={closeModal} closeModal={closeModal} />
                </Modal.Body>
            </Modal.Content>
        </>
    );
};

export default CreateCourseAppointmentModal;
