import { Button, Modal } from 'native-base';
import ContactSupportFormular from '../components/ContactSupportFormular';
import { useTranslation } from 'react-i18next';

type ModalProps = {
    isOpen?: boolean;
    onClose: () => void;
};

const ContactSupportModal: React.FC<ModalProps> = ({ onClose, isOpen }) => {
    const { t } = useTranslation();

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <Modal.Content minW={800}>
                <Modal.CloseButton />
                <Modal.Header>Kontakt Support</Modal.Header>
                <Modal.Body>
                    <ContactSupportFormular onCloseModal={onClose} />
                </Modal.Body>
                <Modal.Footer>
                    <Button onPress={onClose}>{t('cancel')}</Button>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    );
};

export default ContactSupportModal;
