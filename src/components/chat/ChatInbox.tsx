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

            const userOne = new Talk.User({
                id: '2',
                name: 'Jessica Wells',
                email: 'jessicawells@example.com',
                welcomeMessage: 'Hello!',
                role: 'default',
            });

            const userTwo = new Talk.User({
                id: '3',
                name: 'Emma Doe',
                email: 'emmadoe@example.com',
                welcomeMessage: 'Hello!',
                role: 'default',
            });

            const conversationId = Talk.oneOnOneId(currentUser, userOne);
            const conversationIdTwo = Talk.oneOnOneId(currentUser, userTwo);

            const conversation = session.getOrCreateConversation(conversationId);
            const conversationTwo = session.getOrCreateConversation(conversationIdTwo);

            conversation.setParticipant(currentUser);
            conversation.setParticipant(userOne);
            conversationTwo.setParticipant(currentUser);
            conversationTwo.setParticipant(userTwo);
            const inbox = session.createInbox();

            inbox.onSelectConversation(() => openChat(true));
            inbox.mount(inboxRef.current);

            return () => session.destroy();
        }
    }, [openChat, talkLoaded]);

    return <Box bgColor={'amber.500'} h="900px" pr="10" mb="10" w="90%" ref={inboxRef} />;
};

export default ChatInbox;
