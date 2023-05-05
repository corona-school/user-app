import { Box } from 'native-base';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import Talk from 'talkjs';

type InboxProps = {
    openChat: Dispatch<SetStateAction<boolean>>;
};

const ChatInbox: React.FC<InboxProps> = ({ openChat }) => {
    const inboxRef = useRef(null);
    const [talkLoaded, markTalkLoaded] = useState(false);

    useEffect(() => {
        Talk.ready.then(() => markTalkLoaded(true));

        if (talkLoaded) {
            const currentUser = new Talk.User({
                id: '1',
                name: 'John Doe',
                email: 'envkt@example.com',
                welcomeMessage: 'HEY!',
                role: 'default',
            });

            const session = new Talk.Session({
                appId: 't5NarFaG',
                me: currentUser,
            });

            const otherUser = new Talk.User({
                id: '2',
                name: 'Jessica Wells',
                email: 'jessicawells@example.com',
                welcomeMessage: 'Hello!',
                role: 'default',
            });

            const conversationId = Talk.oneOnOneId(currentUser, otherUser);
            const conversation = session.getOrCreateConversation(conversationId);
            conversation.setParticipant(currentUser);
            conversation.setParticipant(otherUser);

            const inbox = session.createInbox();
            inbox.onSelectConversation(() => openChat(true));
            inbox.mount(inboxRef.current);

            return () => session.destroy();
        }
    }, [talkLoaded]);

    return <Box h="800px" pr="10" ref={inboxRef} />;
};

export default ChatInbox;
