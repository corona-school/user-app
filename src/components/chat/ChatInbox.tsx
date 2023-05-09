import { Box, useBreakpointValue } from 'native-base';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import Talk from 'talkjs';
import { useLayoutHelper } from '../../hooks/useLayoutHelper';

type InboxProps = {
    showAddButton: Dispatch<SetStateAction<boolean>>;
};

const ChatInbox: React.FC<InboxProps> = ({ showAddButton }) => {
    const inboxRef = useRef(null);
    const { isMobile } = useLayoutHelper();
    const [talkLoaded, markTalkLoaded] = useState(false);

    const chatHeight = useBreakpointValue({
        base: 'full',
        lg: '90%',
    });
    const paddingRight = useBreakpointValue({
        base: '0',
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
        Talk.ready.then(() => markTalkLoaded(true));

        if (talkLoaded) {
            const currentUser = new Talk.User({
                id: '1',
                name: 'John Doe',
                email: 'envkt@example.com',
                welcomeMessage: 'HEY!',
                role: 'student',
                photoUrl: '../.../assets/icons/avatar_pupils.svg',
                custom: {
                    contact: 'course_participant',
                },
            });

            const session = new Talk.Session({
                appId: 't5NarFaG',
                me: currentUser,
            });

            const userOne = new Talk.User({
                id: '2',
                name: 'Jessica Wells',
                email: 'jessicawells@example.com',
                welcomeMessage: 'Hello!',
                role: 'default',
            });

            const userTwo = new Talk.User({
                id: '3',
                name: 'Emma Wells',
                email: 'emmawells@example.com',
                welcomeMessage: 'Hello!',
                role: 'pupil',
            });

            const conversationId = Talk.oneOnOneId(currentUser, userTwo);

            const conversation = session.getOrCreateConversation(conversationId);
            console.log('CONVERSATION', conversationId, conversation);

            conversation.setParticipant(currentUser);
            conversation.setParticipant(userTwo);

            const inbox = session.createInbox({ showChatHeader: !isMobile, showMobileBackButton: false });
            inbox.onConversationSelected(() => showAddButton(true));
            inbox.onLeaveConversation(() => console.log('LEAVE'));
            inbox.mount(inboxRef.current);

            return () => session.destroy();
        }
    }, [talkLoaded]);

    return <Box h={chatHeight} pr={paddingRight} mb={marginBottom} w={chatWidth} ref={inboxRef} />;
};

export default ChatInbox;
