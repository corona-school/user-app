import { Modal, Button, Row, useTheme, VStack } from 'native-base';
import { useTranslation } from 'react-i18next';
import Tabs from '../components/Tabs';
import { SystemNotifications } from '../components/notifications/preferences/SystemNotifications';
import { MarketingNotifications } from '../components/notifications/preferences/MarketingNotifications';
import { NotificationPreferencesContext } from '../pages/notification/NotficationControlPanel';
import { useUserPreferences } from '../hooks/useNotificationPreferences';

interface NotificationPreferencesModalProps {
    onClose: () => void;
    isOpen: boolean;
}

const NotificationPreferencesModal = ({ isOpen, onClose }: NotificationPreferencesModalProps) => {
    const { space } = useTheme();
    const { t } = useTranslation();
    const userPreferences = useUserPreferences();

    return (
        <Modal onClose={onClose} isOpen={isOpen} size="full">
            <Modal.Content maxH={700}>
                <NotificationPreferencesContext.Provider value={{ ...userPreferences, channels: ['email'] }}>
                    <Modal.CloseButton />
                    <Modal.Header>{t('notification.controlPanel.title')}</Modal.Header>
                    <Modal.Body>
                        <VStack ml={3}>
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
                        </VStack>
                    </Modal.Body>
                    <Modal.Footer>
                        <Row space={space['1']}>
                            <Button onPress={onClose}>{t('cancel')}</Button>
                        </Row>
                    </Modal.Footer>
                </NotificationPreferencesContext.Provider>
            </Modal.Content>
        </Modal>
    );
};

export default NotificationPreferencesModal;
