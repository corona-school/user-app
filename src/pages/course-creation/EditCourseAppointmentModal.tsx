import React from 'react';
import AppointmentCreation from '../create-appointment/AppointmentCreation';
import { BaseModalProps, Modal, ModalHeader, ModalTitle } from '@/components/Modal';
import { useTranslation } from 'react-i18next';
import AppointmentEdit from '@/pages/edit-appointment/AppointmentEdit';

interface ModalProps extends BaseModalProps {
    id: number;
}
const EditCourseAppointmentModal: React.FC<ModalProps> = ({ id, isOpen, onOpenChange }) => {
    const { t } = useTranslation();
    const handleOnClose = () => {
        onOpenChange(false);
    };
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="max-w-full w-[90%] max-h-[90%] flex flex-col md:min-h-auto">
            <ModalHeader>
                <ModalTitle>{t('appointment.title')}</ModalTitle>
            </ModalHeader>
            <div className="flex flex-col p-4 overflow-scroll">
                <AppointmentEdit appointmentId={id} />
            </div>
        </Modal>
    );
};

export default EditCourseAppointmentModal;
