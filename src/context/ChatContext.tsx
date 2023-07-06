import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import Talk from 'talkjs';
import { useUser, useUserType } from '../hooks/useApollo';
import { gql } from '../gql';
import { useQuery } from '@apollo/client';

const TALKJS_APP_ID = process.env.TALKJS_APP_ID;

type IChatContext = {
    session: Talk.Session | null;
    talkLoaded: boolean;
};
const ChatContext = createContext<IChatContext>({
    session: null,
    talkLoaded: false,
});

const userIdToTalkJsId = (userId: string): string => {
    return userId.replace('/', '_');
};

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
    const user = useUser();
    const userType = useUserType();

    const { data, loading } = useQuery(getMyChatSignature);
    // TODO add query to get has unread messages
    const myChatSignature = data?.me.chatSignature;
    const me = {
        id: userIdToTalkJsId(user.userID),
        name: user.firstname,
        role: userType,
        email: user.email,
    };
    useEffect(() => {
        Talk.ready.then(() => markTalkLoaded(true));
    }, []);

    useEffect(() => {
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
    }, [talkLoaded, loading]);

    const contextValue = useMemo(() => ({ session, talkLoaded }), [session, talkLoaded]);

    return <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
    const { session, talkLoaded } = useContext(ChatContext);
    return { session, talkLoaded };
};
