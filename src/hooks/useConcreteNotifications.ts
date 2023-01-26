import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { gql } from '../gql';
import { Concrete_Notification } from '../gql/graphql';
import { isMessageValid } from '../helper/notification-helper';

const userNotificationQuery = gql(`
    query ConcreteNotifications{
        me {
            concreteNotifications(take: 100) {
                id
                message {
                    headline
                    body
                    type
                    navigateTo
                }
                sentAt
            }
        }
    }
`);

export const useConcreteNotifications = () => {
    const { data, loading, error, refetch } = useQuery(userNotificationQuery);
    const [userNotifications, setUserNotifications] = useState<Concrete_Notification[] | null>(null);

    useEffect(() => {
        if (!loading && !error) {
            setUserNotifications(
                data?.me?.concreteNotifications.filter((concreteNotification) => isMessageValid(concreteNotification.message)) as Concrete_Notification[]
            );
        }
    }, [loading, data, error]);

    return { userNotifications, refetch, loading };
};
