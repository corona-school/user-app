import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import Talk from 'talkjs';
import { useUserAuth } from '../hooks/useApollo';
import { gql } from '../gql';
import { useQuery } from '@apollo/client';
import { UnreadConversation } from 'talkjs/all';
import { userIdToTalkJsId } from '../helper/chat-helper';

const TALKJS_APP_ID = process.env.TALKJS_APP_ID;

type IChatContext = {
    session: Talk.Session | null;
    talkLoaded: boolean;
    unreadMessagesCount: number;
};
const ChatContext = createContext<IChatContext>({
    session: null,
    talkLoaded: false,
    unreadMessagesCount: 0,
});

const getMyChatSignature = gql(`
query myChatSignature {
    me {
      userID
      chatSignature
    }
  }`);

export const LFChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Talk.Session | null>(null);
    const [talkLoaded, markTalkLoaded] = useState<boolean>(false);
    const [unreadMessagesCount, setUnreadMessagesCount] = useState<number>(0);

    const { sessionState, user, userId } = useUserAuth();

    const { data, loading } = useQuery(getMyChatSignature, {
        skip: sessionState !== 'logged-in',
    });
    // TODO add query to get has unread messages
    const myChatSignature = data?.me.chatSignature;

    useEffect(() => {
        Talk.ready.then(() => markTalkLoaded(true));
    }, []);

    useEffect(() => {
        if (sessionState !== 'logged-in' || !userId || !user) return;

        const me = {
            id: userIdToTalkJsId(userId),
            name: `${user?.firstname} ${user?.lastname}`,
            role: user?.pupil ? 'pupil' : 'student',
            email: user?.email,
        };

        if (talkLoaded && !loading) {
            const currentUser = new Talk.User(me);

            const session = new Talk.Session({
                appId: 't5NarFaG',
                me: currentUser,
                signature: myChatSignature,
            });
            setSession(session);
            return () => session.destroy();
        }
    }, [talkLoaded, loading, sessionState]);

    useEffect(() => {
        if (!session) return;
        const unreads = session.unreads;

        unreads.onChange((message: UnreadConversation[]) => {
            setUnreadMessagesCount(message.length);
        });
    }, [session]);

    const contextValue = useMemo(() => ({ session, talkLoaded, unreadMessagesCount }), [session, talkLoaded, unreadMessagesCount]);

    return <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
    const { session, talkLoaded, unreadMessagesCount } = useContext(ChatContext);
    return { session, talkLoaded, unreadMessagesCount };
};
