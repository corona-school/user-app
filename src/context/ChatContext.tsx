import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import Talk from 'talkjs';
import { useUserAuth } from '../hooks/useApollo';
import { gql } from '../gql';
import { useQuery } from '@apollo/client';

type IChatContext = {
    session: Talk.Session | null;
    talkLoaded: boolean;
};
const ChatContext = createContext<IChatContext>({
    session: null,
    talkLoaded: false,
});

enum UserRole {
    STUDENT = 'student',
    PUPIL = 'pupil',
}
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
    const { sessionState, userId, user } = useUserAuth();
    const [session, setSession] = useState<Talk.Session | null>(null);
    const [talkLoaded, markTalkLoaded] = useState<boolean>(false);

    const { data } = useQuery(getMyChatSignature, {
        skip: sessionState !== 'logged-in',
    });
    // TODO add query to get has unread messages

    useEffect(() => {
        Talk.ready.then(() => markTalkLoaded(true));
    }, []);

    useEffect(() => {
        if (sessionState !== 'logged-in' || !userId || !user) return;

        const me = {
            id: userIdToTalkJsId(userId),
            name: user?.firstname,
            role: user.student ? UserRole.STUDENT : UserRole.PUPIL,
            email: user.email,
        };

        if (talkLoaded) {
            const currentUser = new Talk.User(me);

            const session = new Talk.Session({
                appId: 't5NarFaG',
                me: currentUser,
                signature: data?.me.chatSignature,
            });
            setSession(session);
            return () => session.destroy();
        }
    }, [sessionState, talkLoaded]);

    const contextValue = useMemo(() => ({ session, talkLoaded }), [session, talkLoaded]);

    return <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
    const { session, talkLoaded } = useContext(ChatContext);
    return { session, talkLoaded };
};
