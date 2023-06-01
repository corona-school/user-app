import { Box, useBreakpointValue } from 'native-base';
import { useEffect, useRef } from 'react';
import { useLayoutHelper } from '../../hooks/useLayoutHelper';
import { useChat } from '../../context/ChatContext';

type InboxProps = {
    selectedId: string;
    showAddButton: (show: boolean) => void;
};
const ChatInbox: React.FC<InboxProps> = ({ selectedId, showAddButton }) => {
    const inboxRef = useRef(null);
    const { isMobile } = useLayoutHelper();
    const { session } = useChat();

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

    useEffect(() => {
        if (!session) return;
        const inbox = session.createInbox({ showChatHeader: !isMobile, showMobileBackButton: false });
        selectedId && inbox.select(selectedId);
        inbox.mount(inboxRef.current);

        return () => session.destroy();
    }, [session]);

    return <Box h={chatHeight} pl={isMobile ? 2 : 0} pr={paddingRight} mb={marginBottom} w={chatWidth} ref={inboxRef} />;
};

export default ChatInbox;
