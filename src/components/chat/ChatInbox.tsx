import { Box, useBreakpointValue } from 'native-base';
import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { useLayoutHelper } from '../../hooks/useLayoutHelper';
import { useChat } from '../../context/ChatContext';

type InboxProps = {
    selectedId: string;
    showBackButton: Dispatch<SetStateAction<boolean>>;
    showAddButton: Dispatch<SetStateAction<boolean>>;
};
const ChatInbox: React.FC<InboxProps> = ({ selectedId, showBackButton, showAddButton }) => {
    const inboxRef = useRef(null);
    const { isMobile } = useLayoutHelper();
    const { session } = useChat();

    const chatHeight = useBreakpointValue({
        base: '90%',
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

    useEffect(() => {
        if (!session) return;
        const inbox = session.createInbox({ showChatHeader: !isMobile, showMobileBackButton: false });
        inbox.select(null);
        selectedId && inbox.select(selectedId);
        isMobile &&
            inbox.onConversationSelected(() => {
                showBackButton(true);
                showAddButton(false);
            });
        isMobile &&
            inbox.onBlur(() => {
                showBackButton(false);
                showAddButton(true);
            });

        inbox.mount(inboxRef.current);

        return () => session.destroy();
    }, [isMobile, selectedId, session, showBackButton]);

    return <Box h={chatHeight} pl={isMobile ? 2 : 0} pr={paddingRight} mb={marginBottom} w={chatWidth} ref={inboxRef} />;
};

export default ChatInbox;
