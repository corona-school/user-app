import React from 'react';
import { useTranslation } from 'react-i18next';
import AsNavigationItem from '../components/AsNavigationItem';
import NotificationAlert from '../components/notifications/NotificationAlert';
import WithNavigation from '../components/WithNavigation';
import Hello from '../widgets/Hello';
import { Stack } from 'native-base';
import HelpNavigation from '../components/HelpNavigation';

const Chat: React.FC = () => {
    const { t } = useTranslation();

    return (
        <AsNavigationItem path="chat">
            <WithNavigation
                headerContent={<Hello />}
                headerTitle={t('appointment.title')}
                headerLeft={
                    <Stack alignItems="center" direction="row">
                        <HelpNavigation />
                        <NotificationAlert />
                    </Stack>
                }
            />{' '}
        </AsNavigationItem>
    );
};

export default Chat;
