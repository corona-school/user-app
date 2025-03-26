import { useContext, useEffect, useState } from 'react';
import { useLastTimeCheckedNotifications } from '../../hooks/useLastTimeCheckedNotifications';
import { useConcreteNotifications } from '../../hooks/useConcreteNotifications';
import NotificationPanel from './NotificationPanel';
import { NotificationsContext } from '../../context/NotificationsProvider';
import { getNewNotifications } from '../../helper/notification-helper';
import { Button } from '../Button';
import { IconBell, IconX } from '@tabler/icons-react';
import { Badge } from '../Badge';
import { Popover, PopoverArrow, PopoverClose, PopoverContent, PopoverTrigger } from '../Popover';
import { useSearchParams } from 'react-router-dom';

const NotificationAlert: React.FC = () => {
    const [count, setCount] = useState<number>(0);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const message = useContext(NotificationsContext);
    const { userNotifications, refetch, loading } = useConcreteNotifications();
    const [searchParams] = useSearchParams();
    const showNotifications = searchParams.has('showNotifications');

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

    useEffect(() => {
        if (showNotifications) {
            searchParams.delete('showNotifications');
            window.history.replaceState({}, '', `${window.location.pathname}?${searchParams.toString()}`);
            handleOnOpenChange(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showNotifications]);

    const handleOnOpenChange = (value: boolean) => {
        setIsOpen(value);
        if (value) {
            refetch();
        } else {
            updateLastTimeChecked();
        }
    };

    return (
        <>
            <Popover onOpenChange={handleOnOpenChange} open={isOpen}>
                <PopoverTrigger asChild>
                    <div className="group flex flex-col relative">
                        {!!count && (
                            <Badge className="z-10 absolute self-start size-4 top-[4px] right-[5px]" variant="destructive" shape="rounded">
                                {count}
                            </Badge>
                        )}
                        <Button className="rounded-full hover:bg-primary-light hover:brightness-105" variant="none" size="icon">
                            <IconBell className="group-hover:animate-bell-ring" size={24} />
                        </Button>
                    </div>
                </PopoverTrigger>
                <PopoverContent align="end" side="bottom" className="min-w-[350px] max-h-[500px] px-0 border-t-transparent">
                    <div className="px-4">
                        <PopoverArrow className="fill-white" />
                        <PopoverClose className="ml-auto block mb-2">
                            <IconX size={18} />
                        </PopoverClose>
                    </div>
                    <NotificationPanel
                        loading={loading}
                        userNotifications={userNotifications || []}
                        lastTimeCheckedNotifications={lastTimeCheckedNotifications}
                        updateLastTimeChecked={() => updateLastTimeChecked()}
                    />
                </PopoverContent>
            </Popover>
        </>
    );
};
export default NotificationAlert;
