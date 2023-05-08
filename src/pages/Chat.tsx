import { useTranslation } from 'react-i18next';
import AsNavigationItem from '../components/AsNavigationItem';
import NotificationAlert from '../components/notifications/NotificationAlert';
import WithNavigation from '../components/WithNavigation';
import Hello from '../widgets/Hello';
import { Box, Stack, useBreakpointValue } from 'native-base';
import HelpNavigation from '../components/HelpNavigation';
import UserChat from '../components/chat/UserChat';
import ChatInbox from '../components/chat/ChatInbox';
import { useState } from 'react';
import FloatinActionButton from '../widgets/FloatingActionButton';
import LFAddChatIcon from '../assets/icons/lernfair/lf-add-chat.svg';

const Chat: React.FC = () => {
    const { t } = useTranslation();
    const [isChatOpen, setIsChatOpen] = useState(false);
    const fabPlace = useBreakpointValue({
        base: 'bottom-right',
        lg: 'top-right',
    });

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
            >
                <FloatinActionButton handlePress={() => console.log('NEW CHAT')} place={fabPlace} icon={<LFAddChatIcon />} />
                <Stack>{!isChatOpen ? <ChatInbox openChat={setIsChatOpen} /> : <UserChat />}</Stack>
            </WithNavigation>
        </AsNavigationItem>
    );
};

export default Chat;
