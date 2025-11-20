import React from 'react';
import AppointmentCreation from '../create-appointment/AppointmentCreation';
import { BaseModalProps, Modal, ModalHeader, ModalTitle } from '@/components/Modal';
import { useTranslation } from 'react-i18next';

interface ModalProps extends BaseModalProps {
    total: number;
}
const CreateCourseAppointmentModal: React.FC<ModalProps> = ({ total, isOpen, onOpenChange }) => {
    const { t } = useTranslation();
    const handleOnClose = () => {
        onOpenChange(false);
    };
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="max-w-full w-[90%] max-h-[90%] flex flex-col md:min-h-auto">
            <ModalHeader>
                <ModalTitle>{t('appointment.title')}</ModalTitle>
            </ModalHeader>
            <div className="flex flex-col p-4 overflow-auto">
                <AppointmentCreation appointmentsTotal={total} isCourseCreation={true} back={handleOnClose} closeModal={handleOnClose} />
            </div>
        </Modal>
    );
};

export default CreateCourseAppointmentModal;
