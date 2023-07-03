import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AsNavigationItem from '../components/AsNavigationItem';
import NotificationAlert from '../components/notifications/NotificationAlert';
import WithNavigation from '../components/WithNavigation';
import { Stack, useBreakpointValue, Box } from 'native-base';
import HelpNavigation from '../components/HelpNavigation';
import FloatingActionButton from '../widgets/FloatingActionButton';
import LFAddChatIcon from '../assets/icons/lernfair/lf-add-chat.svg';
import { LFChatProvider, useChat } from '../context/ChatContext';
import { useLocation } from 'react-router-dom';
import ChatContactsModal from '../modals/ChatContactsModal';
import { useLayoutHelper } from '../hooks/useLayoutHelper';
import { Inbox } from 'talkjs/all';

const Chat: React.FC = () => {
    const inboxRef = useRef(null);
    const [inbox, setInbox] = useState<Inbox | null>();
    const [showAddButton, setShowAddButton] = useState<boolean>(true);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [selectedChatId, setSelectedChatId] = useState<string>('');
    const [isConverstationSelected, setIsConversationSelected] = useState(false);

    const { session } = useChat();
    const { isMobile } = useLayoutHelper();
    const { t } = useTranslation();
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

    const chatHeight = useBreakpointValue({
        base: '75%',
        lg: '90%',
    });
    const paddingRight = useBreakpointValue({
        base: '2',
        lg: '10px',
    });

    const marginBottom = useBreakpointValue({
        base: '0',
        lg: '0',
    });
    const chatWidth = useBreakpointValue({
        base: '100%',
        lg: '90%',
    });

    const handleNewChatPress = () => {
        setIsContactModalOpen(true);
    };

    const onClose = () => {
        setIsContactModalOpen(false);
    };

    useEffect(() => {
        if (!session) return;
        const inbox = session.createInbox({ showChatHeader: !isMobile, showMobileBackButton: false });
        setInbox(inbox);
        inbox.mount(inboxRef.current);
        !isMobile && inbox.select(conversationId ?? selectedChatId);
        inbox.onConversationSelected(() => {
            setIsConversationSelected(true);
            isMobile && setShowAddButton(false);
        });
        inbox.onLeaveConversation(() => {
            setIsConversationSelected(false);
        });

        if (isMobile) {
            // inbox.select()
        }
    }, [session]);

    return (
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
                {showAddButton && (
                    <FloatingActionButton mr={marginRight} mt={marginTop} handlePress={handleNewChatPress} place={fabPlace} icon={<LFAddChatIcon />} />
                )}
                <Box h={chatHeight} pl={isMobile ? 2 : 0} pr={paddingRight} mb={marginBottom} w={chatWidth} ref={inboxRef} />
                <ChatContactsModal isOpen={isContactModalOpen} onClose={onClose} setChatId={(id: string) => setSelectedChatId(id)} />
            </WithNavigation>
        </AsNavigationItem>
    );
};

export default Chat;
