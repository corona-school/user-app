import { Text, Circle, Popover, VStack, useBreakpointValue } from 'native-base';
import { MutableRefObject, useContext, useEffect, useState } from 'react';
import { useLastTimeCheckedNotifications } from '../../hooks/useLastTimeCheckedNotifications';
import { useConcreteNotifications } from '../../hooks/useConcreteNotifications';
import NotificationPanel from './NotificationPanel';
import { NotificationsContext } from '../../context/NotificationsProvider';
import { getNewNotifications } from '../../helper/notification-helper';
import { Button } from '../Button';
import { IconBell } from '@tabler/icons-react';

const NotificationAlert: React.FC = () => {
    const [count, setCount] = useState<number>(0);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const message = useContext(NotificationsContext);
    const { userNotifications, refetch, loading } = useConcreteNotifications();

    const { lastTimeCheckedNotifications, updateLastTimeChecked } = useLastTimeCheckedNotifications();

    const badgeAlign = useBreakpointValue({
        base: 0,
        lg: 2,
    });

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
            <VStack>
                {!!count && (
                    <Circle position="absolute" my={3} mx={badgeAlign} alignSelf="flex-start" bgColor="danger.500" size="3.5" zIndex={1}>
                        <Text fontSize="xs" color="white">
                            {count}
                        </Text>
                    </Circle>
                )}
                <Button onClick={onPress} ref={ref} variant="none" size="icon">
                    <IconBell size={24} />
                </Button>
            </VStack>
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
