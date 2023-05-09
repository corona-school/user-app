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
import { useState } from 'react';

const Chat: React.FC = () => {
    const { t } = useTranslation();
    const [showAddButton, setShowAddButton] = useState(false);
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

    const marginBottom = useBreakpointValue({
        base: '20%',
        lg: 0,
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
                {showAddButton && (
                    <FloatinActionButton
                        mr={marginRight}
                        mt={marginTop}
                        handlePress={() => console.log('NEW CHAT')}
                        place={fabPlace}
                        icon={<LFAddChatIcon />}
                    />
                )}
                <ChatInbox showAddButton={setShowAddButton} />
            </WithNavigation>
        </AsNavigationItem>
    );
};

export default Chat;
