import { createContext, useEffect } from 'react';
import { useWebPush, type WebPushStatus } from '../lib/WebPush';
import { useUserAuth } from '../hooks/useApollo';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { WEBPUSH_ACTIVE } from '../config';

interface WebPushContextValue {
    status: WebPushStatus;
    subscribe: () => Promise<boolean | void>;
    unsubscribe: () => Promise<void>;
}

export const WebPushContext = createContext<WebPushContextValue>({
    status: 'not-subscribed',
    subscribe: async () => {},
    unsubscribe: async () => {},
});

const WebPushProvider = ({ children }: { children: React.ReactNode }) => {
    const [pushEnabled] = useLocalStorage({ key: 'lern-fair-web-push-enabled', initialValue: false });
    const { sessionState } = useUserAuth();
    const { status, subscribe, unsubscribe } = useWebPush();
    useEffect(() => {
        (async () => {
            if (!WEBPUSH_ACTIVE) return;
            if (sessionState === 'logged-in' && status === 'not-subscribed' && pushEnabled) {
                await subscribe();
            }
        })();
    }, [sessionState]);

    return <WebPushContext.Provider value={{ status, subscribe, unsubscribe }}>{children}</WebPushContext.Provider>;
};

export default WebPushProvider;
