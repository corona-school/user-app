import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AsNavigationItem from '../components/AsNavigationItem';
import NotificationAlert from '../components/notifications/NotificationAlert';
import WithNavigation from '../components/WithNavigation';
import { Stack, useBreakpointValue, Box } from 'native-base';
import HelpNavigation from '../components/HelpNavigation';
import FloatingActionButton from '../widgets/FloatingActionButton';
import LFAddChatIcon from '../assets/icons/lernfair/lf-add-chat.svg';
import { useChat } from '../context/ChatContext';
import { useLocation } from 'react-router-dom';
import ChatContactsModal from '../modals/ChatContactsModal';
import { useLayoutHelper } from '../hooks/useLayoutHelper';

const Chat: React.FC = () => {
    const inboxRef = useRef(null);
    const [isContactModalOpen, setIsContactModalOpen] = useState<boolean>(false);
    const [selectedChatId, setSelectedChatId] = useState<string>('');
    const [isConverstationSelected, setIsConversationSelected] = useState<boolean>(false);

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
        const inbox = session.createInbox({
            showChatHeader: !isMobile,
            showMobileBackButton: false,
            messageField: { visible: { access: ['==', 'ReadWrite'] }, placeholder: t('chat.placeholder') },
        });
        inbox.mount(inboxRef.current);
        inbox.select(conversationId ?? selectedChatId);
        if (isMobile) {
            inbox.onConversationSelected(({ conversation }) => {
                if (conversation) return setIsConversationSelected(true);
                setIsConversationSelected(false);
            });
        }
    }, [session, selectedChatId]);

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
                showBack={isMobile && isConverstationSelected}
            >
                {!isConverstationSelected && (
                    <FloatingActionButton mr={marginRight} mt={marginTop} handlePress={handleNewChatPress} place={fabPlace} icon={<LFAddChatIcon />} />
                )}

                <Box h="90%" pl={isMobile ? 2 : 0} pr={paddingRight} mb={marginBottom} w={chatWidth} ref={inboxRef} />
                <ChatContactsModal isOpen={isContactModalOpen} onClose={onClose} setChatId={(id: string) => setSelectedChatId(id)} />
            </WithNavigation>
        </AsNavigationItem>
    );
};

export default Chat;
