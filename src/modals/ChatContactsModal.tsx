import { Modal } from 'native-base';
import ContactList from '../components/chat/ContactList';
import { useTranslation } from 'react-i18next';

type ModalProps = {
    isOpen: boolean;
    setChatId: (id: string) => void;
    onClose: () => void;
};
const ChatContactsModal: React.FC<ModalProps> = ({ isOpen, setChatId, onClose }) => {
    const { t } = useTranslation();
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <Modal.Content minW="400">
                <Modal.Header>{t('chat.modal.startChat')}</Modal.Header>
                <Modal.CloseButton />
                <Modal.Body>
                    <ContactList onClose={onClose} setChatId={(id: string) => setChatId(id)} />
                </Modal.Body>
            </Modal.Content>
        </Modal>
    );
};

export default ChatContactsModal;
