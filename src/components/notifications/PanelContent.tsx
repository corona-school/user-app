import { Box, Button, ScrollView, Text } from 'native-base';
import { useTranslation } from 'react-i18next';
import { isNewNotification } from '../../helper/notification-helper';
import { UserNotification } from '../../types/lernfair/Notification';
import MessageBox from './MessageBox';

type NewProps = {
    notificationsToShow: UserNotification[];
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
                        (notification: UserNotification) =>
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
    userNotifications: UserNotification[];
    lastTimeChecked: string;
};

const AllNotifications: React.FC<AllProps> = ({ userNotifications, lastTimeChecked }) => {
    return (
        <>
            <ScrollView>
                {userNotifications.map(
                    (notification: UserNotification) =>
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
