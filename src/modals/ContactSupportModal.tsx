import { Button, Modal } from 'native-base';
import ContactSupportForm, { ReportInfos } from '../components/ContactSupportForm';
import { useTranslation } from 'react-i18next';

type ModalProps = {
    isOpen?: boolean;
    reportInfos: ReportInfos;
    onClose: () => void;
};

const ContactSupportModal: React.FC<ModalProps> = ({ onClose, isOpen, reportInfos }) => {
    const { t } = useTranslation();

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <Modal.Content minW={800}>
                <Modal.CloseButton />
                <Modal.Header>{t('chat.report.modalHeader')}</Modal.Header>
                <Modal.Body>
                    <ContactSupportForm onCloseModal={onClose} isChatReport reportInfos={reportInfos} />
                </Modal.Body>
                <Modal.Footer>
                    <Button onPress={onClose}>{t('cancel')}</Button>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    );
};

export default ContactSupportModal;
