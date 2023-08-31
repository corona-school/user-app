import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import Talk from 'talkjs';
import { useUserAuth } from '../hooks/useApollo';
import { gql } from '../gql';
import { useQuery } from '@apollo/client';
import { UnreadConversation } from 'talkjs/all';
import { userIdToTalkJsId } from '../helper/chat-helper';
import { TALKJS_APP_ID } from '../config';

interface UserType {
    userID: string;
    firstname: string;
    lastname: string;
    email: string;
    pupil: {
        id: number;
        verifiedAt: Date | null;
    } | null;
    student: {
        id: number;
        verifiedAt: Date | null;
    } | null;
}

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

const shortenLastName = (lastname: string) => {
    if (lastname.length > 0) {
        return lastname.charAt(0).concat('.');
    }
    return '';
};

const getChatName = (user: UserType) => {
    if (user.pupil) {
        return `${user.firstname} ${shortenLastName(user.lastname)}`;
    }
    return `${user.firstname} ${user.lastname}`;
};

export const LFChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Talk.Session | null>(null);
    const [talkLoaded, markTalkLoaded] = useState<boolean>(false);
    const [unreadMessagesCount, setUnreadMessagesCount] = useState<number>(0);

    const { sessionState, user, userId } = useUserAuth();

    const { data, loading } = useQuery(getMyChatSignature, {
        skip: sessionState !== 'logged-in',
    });

    const myChatSignature = data?.me.chatSignature;

    useEffect(() => {
        Talk.ready.then(() => markTalkLoaded(true));
    }, []);

    useEffect(() => {
        // TalkJS is enabled by config:
        if (!TALKJS_APP_ID) return;

        // Wait for the User to be logged in and the User information is determined:
        if (sessionState !== 'logged-in' || !userId || !user) return;
        // Screeners are currently excluded from the Chat:
        if (user.screener) return;

        // Wait for TalkJS to be loaded:
        if (!talkLoaded) return;

        // Wait for the User's Chat Signature to be fetched from the Backend:
        if (loading) return;

        const me = {
            id: userIdToTalkJsId(userId),
            name: getChatName(user),
            role: user?.pupil ? 'pupil' : 'student',
            email: user?.email,
        };

        const currentUser = new Talk.User(me);

        const session = new Talk.Session({
            appId: TALKJS_APP_ID,
            me: currentUser,
            signature: myChatSignature,
        });
        setSession(session);
        return () => session.destroy();
    }, [user, userId, talkLoaded, loading, sessionState, myChatSignature]);

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
