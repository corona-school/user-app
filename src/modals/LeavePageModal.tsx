import { Button } from '@/components/Button';
import { BaseModalProps, Modal, ModalFooter, ModalHeader, ModalTitle } from '@/components/Modal';
import { Typography } from '@/components/Typography';
import { useTranslation } from 'react-i18next';
import { getIconForNotificationPreferenceModal } from '../helper/notification-helper';

interface LeavePageModalProps extends BaseModalProps {
    url: string;
    messageType: string;
    navigateTo: () => void | Window | null;
}
const LeavePageModal = ({ isOpen, onOpenChange, url, messageType, navigateTo }: LeavePageModalProps) => {
    const { t } = useTranslation();
    const Icon = getIconForNotificationPreferenceModal(messageType);

    return (
        <Modal onOpenChange={onOpenChange} isOpen={isOpen}>
            <ModalHeader>
                <ModalTitle>{t('notification.panel.leavePageModal.text')}</ModalTitle>
            </ModalHeader>
            <div className="flex flex-col items-center">
                <Icon className="scale-[0.5]" />
                <Typography className="font-semibold mb-1">{t('notification.panel.leavePageModal.description')}</Typography>
                <Typography className="italic">{url}</Typography>
            </div>
            <ModalFooter>
                <Button className="w-full lg:w-fit" variant="outline" onClick={() => onOpenChange(false)}>
                    {t('notification.controlPanel.closeButton')}
                </Button>
                <Button className="w-full lg:w-fit" onClick={navigateTo}>
                    {t('notification.panel.leavePageModal.button')}
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default LeavePageModal;
