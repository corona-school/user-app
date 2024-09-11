import { Popover } from 'native-base';
import { MutableRefObject, useContext, useEffect, useState } from 'react';
import { useLastTimeCheckedNotifications } from '../../hooks/useLastTimeCheckedNotifications';
import { useConcreteNotifications } from '../../hooks/useConcreteNotifications';
import NotificationPanel from './NotificationPanel';
import { NotificationsContext } from '../../context/NotificationsProvider';
import { getNewNotifications } from '../../helper/notification-helper';
import { Button } from '../Button';
import { IconBell } from '@tabler/icons-react';
import { Badge } from '../Badge';

const NotificationAlert: React.FC = () => {
    const [count, setCount] = useState<number>(0);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const message = useContext(NotificationsContext);
    const { userNotifications, refetch, loading } = useConcreteNotifications();

    const { lastTimeCheckedNotifications, updateLastTimeChecked } = useLastTimeCheckedNotifications();

    useEffect(() => {
        if (message?.id) {
            setCount(count + 1);
        }
        if (isOpen) refetch();
    }, [message?.id]);

    useEffect(() => {
        if (!userNotifications) {
            return;
        }

        const unreadNotifications = getNewNotifications(userNotifications, lastTimeCheckedNotifications);
        setCount(unreadNotifications.length);
    }, [lastTimeCheckedNotifications, userNotifications]);

    const handleTrigger = ({ onPress, ref }: { onPress: () => void; ref: MutableRefObject<any> }): React.ReactElement => {
        return (
            <div className="flex flex-col relative">
                {!!count && (
                    <Badge className="absolute self-start size-4 top-[4px] right-[5px]" variant="destructive" shape="rounded">
                        {count}
                    </Badge>
                )}
                <Button onClick={onPress} ref={ref} variant="none" size="icon">
                    <IconBell size={24} />
                </Button>
            </div>
        );
    };

    const onOpen = () => {
        refetch();
        setIsOpen(true);
    };

    const onClose = () => {
        updateLastTimeChecked();
        setIsOpen(false);
    };

    return (
        <>
            <Popover placement="bottom" trigger={(triggerprops) => handleTrigger(triggerprops)} onClose={onClose} onOpen={onOpen}>
                <NotificationPanel
                    loading={loading}
                    userNotifications={userNotifications || []}
                    lastTimeCheckedNotifications={lastTimeCheckedNotifications}
                    updateLastTimeChecked={() => updateLastTimeChecked()}
                />
            </Popover>
        </>
    );
};
export default NotificationAlert;
