import React from 'react';
import { useTranslation } from 'react-i18next';
import AsNavigationItem from '../components/AsNavigationItem';
import NotificationAlert from '../components/notifications/NotificationAlert';
import WithNavigation from '../components/WithNavigation';
import Hello from '../widgets/Hello';

const Chat: React.FC = () => {
    const { t } = useTranslation();

    return (
        <AsNavigationItem path="chat">
            <WithNavigation headerContent={<Hello />} headerTitle={t('appointment.title')} headerLeft={<NotificationAlert />}></WithNavigation>
        </AsNavigationItem>
    );
};

export default Chat;
