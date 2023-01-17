import { gql, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';

const userNotificationQuery = gql(`
    query {
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
    const [userNotifications, setUserNotifications] = useState();

    useEffect(() => {
        if (!loading && !error) {
            setUserNotifications(data?.me?.concreteNotifications);
        }
    }, [loading, data, error]);

    return { userNotifications, refetch, loading };
};
