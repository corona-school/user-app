import { Box, Toast } from 'native-base';
import MessageBox from '../components/notifications/MessageBox';
import { Concrete_Notification } from '../gql/graphql';

export const showInAppMessage = (notification: Concrete_Notification, isMobile: boolean) => {
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
