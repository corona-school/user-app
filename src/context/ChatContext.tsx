import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import Talk from 'talkjs';
import useApollo from '../hooks/useApollo';

type IChatContext = {
    session: Talk.Session | null;
    talkLoaded: boolean;
};
const ChatContext = createContext<IChatContext>({
    session: null,
    talkLoaded: false,
});

export const LFChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Talk.Session | null>(null);
    const [talkLoaded, markTalkLoaded] = useState<boolean>(false);
    // TODO get userID from logged in user
    // * const userType = useApollo();
    // TODO add query for the current user
    // TODO get signature from BE
    // TODO add query to get has unread messages

    const me = {
        id: '456',
        name: 'AK',
        role: 'pupil',
        email: 'ak@example.com',
        // id: '123',
        // name: 'Lomy',
        // role: 'student',
        // email: 'salome.wick@typedigital.com',
    };
    useEffect(() => {
        Talk.ready.then(() => markTalkLoaded(true));
    }, []);

    useEffect(() => {
        if (talkLoaded) {
            const currentUser = new Talk.User(me);

            const session = new Talk.Session({
                appId: 't5NarFaG',
                me: currentUser,
                // signature:
            });
            setSession(session);
            return () => session.destroy();
        }
    }, [talkLoaded]);

    const contextValue = useMemo(() => ({ session, talkLoaded }), [session, talkLoaded]);

    return <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
    const { session, talkLoaded } = useContext(ChatContext);
    return { session, talkLoaded };
};
