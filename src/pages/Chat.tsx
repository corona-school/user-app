import { useTranslation } from 'react-i18next';
import AsNavigationItem from '../components/AsNavigationItem';
import NotificationAlert from '../components/notifications/NotificationAlert';
import WithNavigation from '../components/WithNavigation';
import Hello from '../widgets/Hello';
import { Stack, useBreakpointValue } from 'native-base';
import HelpNavigation from '../components/HelpNavigation';
import ChatInbox from '../components/chat/ChatInbox';
import FloatinActionButton from '../widgets/FloatingActionButton';
import LFAddChatIcon from '../assets/icons/lernfair/lf-add-chat.svg';
import { useLayoutHelper } from '../hooks/useLayoutHelper';
import { LFChatProvider } from '../context/ChatContext';
import { useState } from 'react';
import ChatContactsModal from '../modals/ChatContactsModal';

const Chat: React.FC = () => {
    const { t } = useTranslation();
    const { isMobile } = useLayoutHelper();
    const [isModalOpen, setIsModalOpen] = useState(false);

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
        setIsModalOpen(true);
    };
    return (
        <LFChatProvider>
            <AsNavigationItem path="chat">
                <WithNavigation
                    headerContent={<Hello />}
                    headerTitle={t('chat.title')}
                    headerLeft={
                        <Stack alignItems="center" direction="row">
                            <HelpNavigation />
                            <NotificationAlert />
                        </Stack>
                    }
                    showBack={isMobile}
                >
                    {/*  TODO mobile version */}
                    <FloatinActionButton mr={marginRight} mt={marginTop} handlePress={handleNewChatPress} place={fabPlace} icon={<LFAddChatIcon />} />
                    <ChatInbox />
                    <ChatContactsModal isOpen={isModalOpen} />
                </WithNavigation>
            </AsNavigationItem>
        </LFChatProvider>
    );
};

export default Chat;
