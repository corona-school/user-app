import { useEffect, useState } from 'react';
import { getAllNewUserNotificationsButMinimumFiveNotifications } from '../../helper/notification-helper';
import { AllNotifications, NewNotifications, NoNotifications } from './PanelContent';
import { Concrete_Notification } from '../../gql/graphql';
import CenterLoadingSpinner from '../CenterLoadingSpinner';

type Props = {
    userNotifications: Concrete_Notification[];
    loading: boolean;
    lastTimeCheckedNotifications: string;
    updateLastTimeChecked: () => void;
};

const NotificationPanel: React.FC<Props> = ({ userNotifications, lastTimeCheckedNotifications, loading, updateLastTimeChecked }) => {
    const [shouldShowAll, setShouldShowAll] = useState<boolean>(false);
    const [notificationsToShow, setNotificationsToShow] = useState<Concrete_Notification[]>([]);

    const handleClick = () => {
        setShouldShowAll(!shouldShowAll);
    };

    useEffect(() => {
        if (userNotifications.length !== 0) {
            if (shouldShowAll) {
                return setNotificationsToShow(userNotifications);
            }
            setNotificationsToShow(getAllNewUserNotificationsButMinimumFiveNotifications(userNotifications, lastTimeCheckedNotifications));
        }
    }, [userNotifications, lastTimeCheckedNotifications, shouldShowAll]);

    const hasNotifications = userNotifications.length && notificationsToShow.length;
    return (
        <div className="max-h-[400px] overflow-y-scroll">
            <div className="px-4">
                {loading && <CenterLoadingSpinner />}
                {!shouldShowAll && notificationsToShow.length !== 0 && (
                    <NewNotifications
                        notificationsToShow={notificationsToShow}
                        lastTimeChecked={lastTimeCheckedNotifications}
                        handleClick={handleClick}
                        updateLastTimeChecked={() => updateLastTimeChecked()}
                    />
                )}
                {shouldShowAll && <AllNotifications userNotifications={notificationsToShow} lastTimeChecked={lastTimeCheckedNotifications} />}
                {!loading && !hasNotifications && <NoNotifications />}
            </div>
        </div>
    );
};

export default NotificationPanel;
