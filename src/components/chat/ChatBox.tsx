import { Box } from 'native-base';
import { useEffect, useRef, useState } from 'react';
import Talk from 'talkjs';

const ChatBox = () => {
    const chatboxEl = useRef(null);
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

            const chatbox = session.createChatbox({
                showChatHeader: false,
            });
            chatbox.select(conversation);
            chatbox.mount(chatboxEl.current);

            return () => session.destroy();
        }
    }, [talkLoaded]);

    return <Box bgColor={'blue.600'} ref={chatboxEl} w="80%" px="10" height="900px" mb="10" />;
};

export default ChatBox;
