import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { gql } from '../gql';
import { Concrete_Notification, Notification_Channel_Enum } from '../gql/graphql';
import { isMessageValid } from '../helper/notification-helper';

const userNotificationQuery = gql(`
    query ConcreteNotifications{
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
                notification {
                    disabledChannels
                }
            }
        }
    }
`);

export const useConcreteNotifications = () => {
    const { data, loading, error, refetch } = useQuery(userNotificationQuery);
    const [userNotifications, setUserNotifications] = useState<Concrete_Notification[] | null>(null);

    useEffect(() => {
        if (!loading && !error) {
            const validNotifications = data?.me?.concreteNotifications.filter((concreteNotification) => {
                return (
                    isMessageValid(concreteNotification.message) &&
                    !concreteNotification.notification.disabledChannels.includes(Notification_Channel_Enum.Inapp)
                );
            });
            setUserNotifications(validNotifications as Concrete_Notification[]);
        }
    }, [loading, data, error]);

    return { userNotifications, refetch, loading };
};
