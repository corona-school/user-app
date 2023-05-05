import { useTranslation } from 'react-i18next';
import AsNavigationItem from '../components/AsNavigationItem';
import NotificationAlert from '../components/notifications/NotificationAlert';
import WithNavigation from '../components/WithNavigation';
import Hello from '../widgets/Hello';
import { Box, Stack } from 'native-base';
import HelpNavigation from '../components/HelpNavigation';
import UserChat from '../components/chat/UserChat';
import ChatInbox from '../components/chat/ChatInbox';
import { useState } from 'react';

const Chat: React.FC = () => {
    const { t } = useTranslation();
    const [isChatOpen, setIsChatOpen] = useState(false);

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
            />

            <Stack pl="290px">{!isChatOpen ? <ChatInbox openChat={setIsChatOpen} /> : <UserChat />}</Stack>
        </AsNavigationItem>
    );
};

export default Chat;
