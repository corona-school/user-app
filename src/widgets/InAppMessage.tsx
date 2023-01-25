import { Box, Toast } from 'native-base';
import MessageBox from '../components/notifications/MessageBox';
import { UserNotification } from '../types/lernfair/Notification';

export const showInAppMessage = (notification: UserNotification, isMobile: boolean) => {
    if (!notification || !notification.message) return null;

    return Toast.show({
        placement: isMobile ? 'top' : 'top-right',
        render: () => {
            return (
                <Box mr={5}>
                    <MessageBox key={notification.id} isStandalone={true} userNotification={notification} />
                </Box>
            );
        },
    });
};
