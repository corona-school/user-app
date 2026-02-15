import { useEffect, useState } from 'react';
import { getAllNewUserNotificationsButMinimumFiveNotifications } from '../../helper/notification-helper';
import { AllNotifications, NewNotifications, NoNotifications } from './PanelContent';
import { Concrete_Notification } from '../../gql/graphql';
import CenterLoadingSpinner from '../CenterLoadingSpinner';
import { useLastTimeCheckedNotifications } from '@/hooks/useLastTimeCheckedNotifications';
import { useQuery } from '@apollo/client';

type Props = {
    unreadNotifications: Concrete_Notification[];
};

const lastFiveNotificationsQuery = gql(`
    query LastFiveNotifications {
        me {
            concreteNotifications(take: 5) {
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

const allNotificationsQuery = gql(`
    query LastHundredNotifications {
        me {
            concreteNotifications(take: 100) {
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

const NotificationPanel: React.FC<Props> = ({ unreadNotifications }) => {
    const [shouldShowAll, setShouldShowAll] = useState<boolean>(false);
    const { lastTimeCheckedNotifications, updateLastTimeChecked } = useLastTimeCheckedNotifications();

    // If there are less than 5 unread notifications, show the last 5 ones instead
    const { data: last5Notifications, loading: loadingLast5 } = useQuery(lastFiveNotificationsQuery, {
        skip: unreadNotifications.length > 5 || shouldShowAll,
    });

    const { data: allNotifications, loading: loadingAll } = useQuery(allNotificationsQuery, {
        skip: !shouldShowAll,
    });

    const loading = shouldShowAll ? loadingAll : loadingLast5;
    const notificationsToShow = shouldShowAll ? allNotifications : last5Notifications ?? unreadNotifications;

    return (
        <div className="max-h-[400px] overflow-y-scroll">
            <div className="px-4">
                {loading && <CenterLoadingSpinner />}
                {!shouldShowAll && !loading && !!notificationsToShow.length && (
                    <NewNotifications
                        notificationsToShow={notificationsToShow}
                        lastTimeChecked={lastTimeCheckedNotifications}
                        handleClick={() => setShouldShowAll(true)}
                        updateLastTimeChecked={() => updateLastTimeChecked()}
                    />
                )}
                {shouldShowAll && !!notificationsToShow.length && (
                    <AllNotifications userNotifications={notificationsToShow} lastTimeChecked={lastTimeCheckedNotifications} />
                )}
                {!loading && !notificationsToShow.length && <NoNotifications />}
            </div>
        </div>
    );
};

export default NotificationPanel;
