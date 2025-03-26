import { Button } from '@/components/Button';
import { BaseModalProps, Modal, ModalFooter, ModalHeader, ModalTitle } from '@/components/Modal';
import { Typography } from '@/components/Typography';
import { useUserPreferences } from '@/hooks/useNotificationPreferences';
import { useWebPush } from '@/lib/WebPush';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface ActivateNotificationsModalProps extends BaseModalProps {}

const ActivateNotificationsModal = ({ isOpen, onOpenChange }: ActivateNotificationsModalProps) => {
    const { t } = useTranslation();
    const { subscribe } = useWebPush();
    const { userPreferences, updateUserPreferences } = useUserPreferences();

    const handleOnActivateNotifications = async () => {
        const preferences = {
            ...userPreferences,
            chat: { ...userPreferences.chat, push: true },
            appointment: { ...userPreferences.appointment, push: true },
            announcement: { ...userPreferences.announcement, push: true },
        };
        await updateUserPreferences(preferences);
        await subscribe();
        toast.success(t('notification.controlPanel.preference.preferencesUpdated'));
        onOpenChange(false);
    };

    return (
        <Modal onOpenChange={onOpenChange} isOpen={isOpen}>
            <ModalHeader>
                <ModalTitle>{t('notification.activateNotificationsModal.title')}</ModalTitle>
            </ModalHeader>

            <div className="flex flex-col py-4">
                <Typography>{t('notification.activateNotificationsModal.description')}</Typography>
            </div>

            <ModalFooter>
                <Button className="w-full lg:w-fit" variant="outline" onClick={() => onOpenChange(false)}>
                    {t('notification.activateNotificationsModal.cancelButton')}
                </Button>
                <Button className="w-full lg:w-fit" onClick={handleOnActivateNotifications}>
                    {t('notification.activateNotificationsModal.confirmButton')}
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default ActivateNotificationsModal;
