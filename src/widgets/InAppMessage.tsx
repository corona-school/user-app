import MessageBox from '../components/notifications/MessageBox';
import { Concrete_Notification } from '../gql/graphql';
import { toast } from 'sonner';

export const showInAppMessage = (notification: Concrete_Notification) => {
    if (!notification || !notification.message) return null;

    const handleOnClickNotification = () => {
        toast.dismiss(notification.id);
    };

    toast.custom(
        () => (
            <div className="w-fit" onClick={handleOnClickNotification}>
                <MessageBox className="mb-0" key={notification.id} isStandalone={true} userNotification={notification} onClose={handleOnClickNotification} />
            </div>
        ),
        {
            position: 'top-right',
            className: 'top-4 right-0 flex justify-center lg:justify-end',
            id: notification.id,
        }
    );
};
