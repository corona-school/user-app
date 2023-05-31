import { useTranslation } from 'react-i18next';
import AsNavigationItem from '../components/AsNavigationItem';
import NotificationAlert from '../components/notifications/NotificationAlert';
import WithNavigation from '../components/WithNavigation';
import { Stack, useBreakpointValue } from 'native-base';
import HelpNavigation from '../components/HelpNavigation';
import ChatInbox from '../components/chat/ChatInbox';
import FloatinActionButton from '../widgets/FloatingActionButton';
import LFAddChatIcon from '../assets/icons/lernfair/lf-add-chat.svg';
import { useLayoutHelper } from '../hooks/useLayoutHelper';
import { LFChatProvider } from '../context/ChatContext';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import ChatContactsModal from '../modals/ChatContactsModal';

const Chat: React.FC = () => {
    const { t } = useTranslation();
    const { isMobile } = useLayoutHelper();
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [selectedChatId, setSelectedChatId] = useState<string>('');

    const location = useLocation();
    const locationState = location.state as { conversationId: string };
    const conversationId = locationState?.conversationId;

    const fabPlace = useBreakpointValue({
        base: 'bottom-right',
        lg: 'top-right',
    });

    const marginRight = useBreakpointValue({
        base: 5,
        lg: 70,
    });

    const marginTop = useBreakpointValue({
        base: 0,
        lg: '4%',
    });

    const handleNewChatPress = () => {
        setIsContactModalOpen(true);
    };

    const onClose = () => {
        setIsContactModalOpen(false);
    };

    return (
        <LFChatProvider>
            <AsNavigationItem path="chat">
                <WithNavigation
                    headerTitle={t('chat.title')}
                    headerLeft={
                        <Stack alignItems="center" direction="row">
                            <HelpNavigation />
                            <NotificationAlert />
                        </Stack>
                    }
                    showBack={isMobile}
                >
                    <FloatinActionButton mr={marginRight} mt={marginTop} handlePress={handleNewChatPress} place={fabPlace} icon={<LFAddChatIcon />} />
                    <ChatInbox selectedId={conversationId ?? selectedChatId} />
                    <ChatContactsModal isOpen={isContactModalOpen} onClose={onClose} setChatId={(id: string) => setSelectedChatId(id)} />
                </WithNavigation>
            </AsNavigationItem>
        </LFChatProvider>
    );
};

export default Chat;
