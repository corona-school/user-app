import { Box, useBreakpointValue } from 'native-base';
import { useEffect, useRef, useState } from 'react';
import Talk from 'talkjs';
import { useLayoutHelper } from '../../hooks/useLayoutHelper';
import { useChat } from '../../context/ChatContext';

type InboxProps = {};

const ChatInbox: React.FC<InboxProps> = ({}) => {
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
        inbox.setFeedFilter({});
        inbox.mount(inboxRef.current);

        return () => session.destroy();
    }, [isMobile, session]);

    return <Box h={chatHeight} pl={isMobile ? 2 : 0} pr={paddingRight} mb={marginBottom} w={chatWidth} ref={inboxRef} />;
};

export default ChatInbox;
