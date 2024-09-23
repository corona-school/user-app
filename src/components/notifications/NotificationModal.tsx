import { useTranslation } from 'react-i18next';
import { getIconForNotificationPreferenceModal } from '../../helper/notification-helper';
import { Button } from '../Button';
import { BaseModalProps, Modal, ModalFooter, ModalHeader, ModalTitle } from '../Modal';
import { Typography } from '../Typography';

interface NotificationModalProps extends BaseModalProps {
    messageType: string;
    headline?: string;
    modalText: string;
}
const NotificationModal = ({ isOpen, onOpenChange, messageType, headline, modalText }: NotificationModalProps) => {
    const { t } = useTranslation();

    const Icon = getIconForNotificationPreferenceModal(messageType);

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalHeader>
                <ModalTitle>{headline}</ModalTitle>
            </ModalHeader>
            <div className="flex flex-col items-center">
                <Icon className="scale-[0.5]" />
                <Typography>{modalText}</Typography>
            </div>
            <ModalFooter>
                <Button className="w-full lg:w-fit" variant="outline" onClick={() => onOpenChange(false)}>
                    {t('notification.controlPanel.closeButton')}
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default NotificationModal;
