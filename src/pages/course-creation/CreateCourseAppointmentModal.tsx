import { Modal } from 'native-base';
import React from 'react';
import AppointmentCreation from '../create-appointment/AppointmentCreation';

type ModalProps = {
    onCreate: () => void;
};
const CreateCourseAppointmentModal: React.FC<ModalProps> = ({ onCreate }) => {
    return (
        <>
            <Modal.Content minW="80%" marginX="auto" p={5}>
                <Modal.CloseButton />
                <Modal.Body>
                    <AppointmentCreation isCourseCreation={true} back={() => console.log('close modal')} onCreate={onCreate} />
                </Modal.Body>
            </Modal.Content>
        </>
    );
};

export default CreateCourseAppointmentModal;
