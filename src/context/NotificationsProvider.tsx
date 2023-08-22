import { createContext, FC, ReactNode } from 'react';
import { useIncomingWSConcreteNotificationId } from '../hooks/useIncomingWSConcreteNotificationId';
import { useConcreteNotification } from '../hooks/useConcreteNotification';
import { Concrete_Notification } from '../gql/graphql';

export const NotificationsContext = createContext<Concrete_Notification | null>(null);

export const NotificationsProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const concreteNotificationId = useIncomingWSConcreteNotificationId();
    const message = useConcreteNotification(concreteNotificationId || 0);

    return <NotificationsContext.Provider value={message}>{children}</NotificationsContext.Provider>;
};
