import { Box, Button, ScrollView, Text } from 'native-base';
import { useTranslation } from 'react-i18next';
import { isNewNotification } from '../../helper/notification-helper';
import MessageBox from './MessageBox';
import { Concrete_Notification } from '../../gql/graphql';

type NewProps = {
    notificationsToShow: Concrete_Notification[];
    lastTimeChecked: string;
    handleClick: () => void;
};

const NewNotifications: React.FC<NewProps> = ({ notificationsToShow, lastTimeChecked, handleClick }) => {
    const { t } = useTranslation();

    return (
        <>
            <ScrollView>
                <Box>
                    {notificationsToShow.map(
                        (notification) =>
                            notification.message && (
                                <MessageBox
                                    key={notification.id}
                                    userNotification={notification}
                                    isRead={isNewNotification(notification.sentAt, lastTimeChecked)}
                                />
                            )
                    )}
                </Box>
            </ScrollView>
            <Button onPress={handleClick} variant={'outline'}>
                <Text fontSize="xs">{t('notification.panel.button.text')}</Text>
            </Button>
        </>
    );
};

type AllProps = {
    userNotifications: Concrete_Notification[];
    lastTimeChecked: string;
};

const AllNotifications: React.FC<AllProps> = ({ userNotifications, lastTimeChecked }) => {
    return (
        <>
            <ScrollView>
                {userNotifications.map(
                    (notification: Concrete_Notification) =>
                        notification.message && (
                            <MessageBox
                                key={notification.id}
                                userNotification={notification}
                                isRead={isNewNotification(notification.sentAt, lastTimeChecked)}
                            />
                        )
                )}
            </ScrollView>
        </>
    );
};

const NoNotifications = () => {
    const { t } = useTranslation();
    return (
        <Box>
            <Text>{t('notification.panel.noNotifications')}</Text>
        </Box>
    );
};

export { NewNotifications, AllNotifications, NoNotifications };
