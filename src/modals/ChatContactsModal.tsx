import { Modal } from 'native-base';
import React, { Dispatch, SetStateAction } from 'react';
import ContactList from '../components/chat/ContactList';
import { useTranslation } from 'react-i18next';

type ModalProps = {
    isOpen: boolean;
    onClose: Dispatch<SetStateAction<boolean>>;
};
const ChatContactsModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <Modal.Content>
                <Modal.Header>{t('chat.modal.startChat')}</Modal.Header>
                <Modal.CloseButton />

                <Modal.Body>
                    <ContactList closeModal={onClose} />
                </Modal.Body>
            </Modal.Content>
        </Modal>
    );
};

export default ChatContactsModal;
