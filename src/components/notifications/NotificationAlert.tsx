import { useContext, useEffect, useState } from 'react';
import { useLastTimeCheckedNotifications } from '../../hooks/useLastTimeCheckedNotifications';
import NotificationPanel from './NotificationPanel';
import { NotificationsContext } from '../../context/NotificationsProvider';
import { isMessageValid } from '../../helper/notification-helper';
import { Button } from '../Button';
import { IconBell, IconX } from '@tabler/icons-react';
import { Badge } from '../Badge';
import { Popover, PopoverArrow, PopoverClose, PopoverContent, PopoverTrigger } from '../Popover';
import { useSearchParams, useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { gql } from '@/gql';

const unreadNotificationsQuery = gql(`
    query UnreadNotifications {
        me {
            concreteNotifications(take: 100, onlyUnread: true) {
                id
                message {
                    headline
                    body
                    modalText
                    type
                    navigateTo
                }
                sentAt
            }
        }
    }
`);

const NotificationAlert: React.FC = () => {
    const [count, setCount] = useState<number>(0);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const message = useContext(NotificationsContext);
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const { pathname } = location;
    const isChat = pathname.includes('/chat');
    const showNotifications = searchParams.has('showNotifications');

    const { updateLastTimeChecked } = useLastTimeCheckedNotifications();
    const { data: unreadNotificationsData, loading, refetch } = useQuery(unreadNotificationsQuery);
    const unreadNotifications = unreadNotificationsData?.me.concreteNotifications.filter((it) => isMessageValid(it.message));

    useEffect(() => {
        if (message?.id) {
            setCount(count + 1);
        }
        if (isOpen) refetch();
    }, [message?.id]);

    useEffect(() => {
        if (!unreadNotifications) {
            return;
        }

        setCount(unreadNotifications.length);
    }, [unreadNotifications]);

    useEffect(() => {
        if (showNotifications) {
            searchParams.delete('showNotifications');
            window.history.replaceState({}, '', `${window.location.pathname}?${searchParams.toString()}`);
            if (!isChat) {
                handleOnOpenChange(true);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showNotifications, isChat]);

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
                    <NotificationPanel unreadNotifications={unreadNotifications ?? []} />
                </PopoverContent>
            </Popover>
        </>
    );
};
export default NotificationAlert;
