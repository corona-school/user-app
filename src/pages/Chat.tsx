import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AsNavigationItem from '../components/AsNavigationItem';
import NotificationAlert from '../components/notifications/NotificationAlert';
import WithNavigation from '../components/WithNavigation';
import { Stack, useBreakpointValue, Box, Modal } from 'native-base';
import HelpNavigation from '../components/HelpNavigation';
import FloatingActionButton from '../widgets/FloatingActionButton';
import LFAddChatIcon from '../assets/icons/lernfair/lf-add-chat.svg';
import { useChat } from '../context/ChatContext';
import { useLocation } from 'react-router-dom';
import ChatContactsModal from '../modals/ChatContactsModal';
import { useLayoutHelper } from '../hooks/useLayoutHelper';
import ContactSupportModal, { ReportInfos } from '../modals/ContactSupportModal';
import { MessageActionEvent } from 'talkjs/all';
import { DateTime } from 'luxon';

const Chat: React.FC = () => {
    const inboxRef = useRef(null);
    const [isContactModalOpen, setIsContactModalOpen] = useState<boolean>(false);
    const [isSupportContactModalOpen, setIsSupportContactModalOpen] = useState<boolean>(false);
    const [selectedChatId, setSelectedChatId] = useState<string>('');
    const [isConverstationSelected, setIsConversationSelected] = useState<boolean>(false);
    const [reportInfos, setReportInfos] = useState<ReportInfos>({
        message: '',
        messageId: '',
        messageType: '',
        sender: '',
        senderId: '',
        sentAt: '',
        conversationType: '',
        subject: '',
        conversationId: '',
    });

    const { session } = useChat();
    const { isMobile } = useLayoutHelper();
    const { t } = useTranslation();
    const location = useLocation();

    const locationState = location.state as { conversationId: string };
    const conversationId = locationState?.conversationId;

    const paddingRight = useBreakpointValue({
        base: '2',
        lg: '10px',
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

    const handleContactSupport = (event: MessageActionEvent) => {
        const { id, body, sender, senderId, type, timestamp, conversation } = event.message;
        const sentAt = DateTime.fromMillis(timestamp).toISO();

        setReportInfos({
            message: body,
            messageId: id,
            messageType: type,
            sender: sender?.name ?? '',
            senderId: senderId ?? '',
            sentAt: sentAt,
            conversationType: conversation.custom.groupType ? 'group' : 'one-on-one',
            conversationId: conversation.id,
            ...(conversation.subject ? { subject: conversation.subject } : {}),
        });
        setIsSupportContactModalOpen(true);
    };

    useEffect(() => {
        if (!session) return;
        const inbox = session.createInbox({
            showMobileBackButton: false,
            messageField: { visible: { access: ['==', 'ReadWrite'] }, placeholder: t('chat.placeholder') },
        });
        inbox.mount(inboxRef.current);
        inbox.select(conversationId ?? selectedChatId);
        inbox.onCustomMessageAction('contact-support', (event) => handleContactSupport(event));

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
                {!isConverstationSelected && <FloatingActionButton handlePress={handleNewChatPress} place={'bottom-right'} icon={<LFAddChatIcon />} />}

                <Box h="90%" pl={isMobile ? 2 : 0} pr={paddingRight} w={chatWidth} ref={inboxRef} />
                <Modal isOpen={isContactModalOpen} onClose={onClose}>
                    <ChatContactsModal onClose={onClose} setChatId={(id: string) => setSelectedChatId(id)} />
                </Modal>
                <ContactSupportModal
                    isOpen={isSupportContactModalOpen}
                    onClose={() => {
                        setIsSupportContactModalOpen(false);
                    }}
                    reportInfos={reportInfos}
                />
            </WithNavigation>
        </AsNavigationItem>
    );
};

export default Chat;
