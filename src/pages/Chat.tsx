import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AsNavigationItem from '../components/AsNavigationItem';
import NotificationAlert from '../components/notifications/NotificationAlert';
import WithNavigation from '../components/WithNavigation';
import { Stack, useBreakpointValue, Modal } from 'native-base';
import SwitchLanguageButton from '../components/SwitchLanguageButton';
import FloatingActionButton from '../components/FloatingActionButton';
import LFAddChatIcon from '../assets/icons/lernfair/lf-add-chat.svg';
import { useChat } from '../context/ChatContext';
import { useLocation, useSearchParams } from 'react-router-dom';
import ChatContactsModal from '../modals/ChatContactsModal';
import { useLayoutHelper } from '../hooks/useLayoutHelper';
import { ChatContactSupportModal, ReportInfos } from '../modals/ChatContactSupportModal';
import { Inbox, MessageActionEvent } from 'talkjs/all';
import { DateTime } from 'luxon';
import { useUser } from '@/hooks/useApollo';

const Chat: React.FC = () => {
    const inboxRef = useRef(null);
    const inboxObject = useRef<null | Inbox>(null);
    const [isContactModalOpen, setIsContactModalOpen] = useState<boolean>(false);
    const [isSupportContactModalOpen, setIsSupportContactModalOpen] = useState<boolean>(false);
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
    const [searchParams] = useSearchParams();
    const conversationIdParam = searchParams.get('conversationId');
    const messageTemplateId = searchParams.get('messageTemplateId');
    const { firstname } = useUser();

    const messageTemplates: Record<string, (params: any) => string> = {
        setupCalendarPreferences: (params) => t('matching.availability.setupPreferencesChatMessage', params),
    };

    const locationState = location.state as { conversationId: string };
    const conversationId = locationState?.conversationId ?? conversationIdParam;
    const messageTemplate = messageTemplateId ? messageTemplates[messageTemplateId] : null;
    const [selectedChatId, setSelectedChatId] = useState<string>(conversationId);

    useEffect(() => {
        if (conversationIdParam) {
            searchParams.delete('conversationId');
            window.history.replaceState({}, '', `${window.location.pathname}?${searchParams.toString()}`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conversationId]);

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

    const handleBack = () => {
        if (!inboxObject.current) {
            return;
        }
        inboxObject.current.select(null);
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
            messageField: { visible: { access: ['==', 'ReadWrite'] }, placeholder: t('chat.placeholder'), enterSendsMessage: false },
        });

        inbox.mount(inboxRef.current);
        inbox.select(selectedChatId);
        inbox.onCustomMessageAction('contact-support', (event) => handleContactSupport(event));

        if (inbox?.isAlive && messageTemplate) {
            inbox.messageField.setText(messageTemplate({ myName: firstname, link: `${window.origin}/calendar-preferences` }));
            searchParams.delete('messageTemplateId');
            window.history.replaceState({}, '', `${window.location.pathname}?${searchParams.toString()}`);
        }

        inbox.onConversationSelected((event) => {
            if (!event.conversation?.id) return;
            setSelectedChatId(event.conversation?.id.toString());
        });

        inboxObject.current = inbox;
        if (isMobile) {
            inbox.onConversationSelected(({ conversation }) => {
                if (conversation) return setIsConversationSelected(true);
                setIsConversationSelected(false);
            });
        }
    }, [isMobile, selectedChatId, session]);

    return (
        <AsNavigationItem path="chat">
            <WithNavigation
                headerTitle={t('chat.title')}
                headerLeft={
                    <Stack alignItems="center" direction="row">
                        <SwitchLanguageButton />
                        <NotificationAlert />
                    </Stack>
                }
                showBack={isMobile && isConverstationSelected}
                onBack={() => handleBack()}
            >
                {!isConverstationSelected && <FloatingActionButton handlePress={handleNewChatPress} place={'bottom-right'} icon={<LFAddChatIcon />} />}
                <div style={{ height: '100%', width: chatWidth, paddingLeft: isMobile ? 4 : 0, paddingRight: paddingRight }} ref={inboxRef} />
                <Modal isOpen={isContactModalOpen} onClose={onClose}>
                    <ChatContactsModal
                        onClose={onClose}
                        setChatId={(id: string) => {
                            setSelectedChatId(id);
                        }}
                    />
                </Modal>
                <ChatContactSupportModal
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
