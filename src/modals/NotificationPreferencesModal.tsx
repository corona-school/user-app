import { useTranslation } from 'react-i18next';
import Tabs from '../components/Tabs';
import { SystemNotifications } from '../components/notifications/preferences/SystemNotifications';
import { MarketingNotifications } from '../components/notifications/preferences/MarketingNotifications';
import { NotificationPreferencesContext } from '../pages/notification/NotficationControlPanel';
import { useUserPreferences } from '../hooks/useNotificationPreferences';
import { BaseModalProps, Modal, ModalFooter, ModalHeader, ModalTitle } from '@/components/Modal';
import { Button } from '@/components/Button';

interface NotificationPreferencesModalProps extends BaseModalProps {}

const NotificationPreferencesModal = ({ isOpen, onOpenChange }: NotificationPreferencesModalProps) => {
    const { t } = useTranslation();
    const userPreferences = useUserPreferences();

    return (
        <Modal className="w-full md:max-w-[800px] px-2 md:px-6" onOpenChange={onOpenChange} isOpen={isOpen}>
            <ModalHeader>
                <ModalTitle>{t('notification.controlPanel.title')}</ModalTitle>
            </ModalHeader>
            <div className="md:max-h-[500px] overflow-auto">
                <NotificationPreferencesContext.Provider value={{ ...userPreferences, channels: ['email'] }}>
                    <div className="flex">
                        <Tabs
                            tabs={[
                                {
                                    title: t('notification.controlPanel.tabs.system.title'),
                                    content: <SystemNotifications />,
                                },
                                {
                                    title: t('notification.controlPanel.tabs.newsletter.title'),
                                    content: <MarketingNotifications />,
                                },
                            ]}
                        />
                    </div>
                    <ModalFooter>
                        <Button className="w-full lg:w-fit" variant="outline" onClick={() => onOpenChange(false)}>
                            {t('cancel')}
                        </Button>
                    </ModalFooter>
                </NotificationPreferencesContext.Provider>
            </div>
        </Modal>
    );
};

export default NotificationPreferencesModal;
