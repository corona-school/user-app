import { Modal } from 'native-base';
import ContactList from '../widgets/ContactList';
import { useTranslation } from 'react-i18next';

type ModalProps = {
    setChatId: (id: string) => void;
    onClose: () => void;
};
const ChatContactsModal: React.FC<ModalProps> = ({ setChatId, onClose }) => {
    const { t } = useTranslation();
    return (
        <>
            <Modal.Content minW="400">
                <Modal.Header>{t('chat.modal.startChat')}</Modal.Header>
                <Modal.CloseButton />
                <Modal.Body>
                    <ContactList onClose={onClose} setChatId={(id: string) => setChatId(id)} />
                </Modal.Body>
            </Modal.Content>
        </>
    );
};

export default ChatContactsModal;
