import { useTranslation } from 'react-i18next';
import { isNewNotification } from '../../helper/notification-helper';
import MessageBox from './MessageBox';
import { Concrete_Notification } from '../../gql/graphql';
import { Button } from '../Button';
import { Typography } from '../Typography';

type NewProps = {
    notificationsToShow: Concrete_Notification[];
    lastTimeChecked: string;
    handleClick: () => void;
    updateLastTimeChecked: () => void;
};

const NewNotifications: React.FC<NewProps> = ({ notificationsToShow, lastTimeChecked, handleClick, updateLastTimeChecked }) => {
    const { t } = useTranslation();

    return (
        <>
            {notificationsToShow.map(
                (notification) =>
                    notification.message && (
                        <MessageBox
                            key={notification.id}
                            userNotification={notification}
                            isRead={isNewNotification(notification.sentAt, lastTimeChecked)}
                            updateLastTimeChecked={() => updateLastTimeChecked()}
                        />
                    )
            )}
            <Button className="w-full mt-2" onClick={handleClick} variant="outline" size="sm">
                {t('notification.panel.button.text')}
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
            {userNotifications.map(
                (notification: Concrete_Notification) =>
                    notification.message && (
                        <MessageBox key={notification.id} userNotification={notification} isRead={isNewNotification(notification.sentAt, lastTimeChecked)} />
                    )
            )}
        </>
    );
};

const NoNotifications = () => {
    const { t } = useTranslation();
    return (
        <div>
            <Typography>{t('notification.panel.noNotifications')}</Typography>
        </div>
    );
};

export { NewNotifications, AllNotifications, NoNotifications };
