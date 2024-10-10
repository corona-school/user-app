import { useEffect, FC, useContext } from 'react';
import { showInAppMessage } from '../widgets/InAppMessage';
import { NotificationsContext } from '../context/NotificationsProvider';

export const ToastNotifications: FC = () => {
    const message = useContext(NotificationsContext);

    useEffect(() => {
        if (message !== null) showInAppMessage(message);
    }, [message]);

    return null;
};
