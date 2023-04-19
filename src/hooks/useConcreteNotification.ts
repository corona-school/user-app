import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { isMessageValid } from '../helper/notification-helper';
import { gql } from '../gql';
import { Concrete_Notification } from '../gql/graphql';

const concreteNotificationQuery = gql(`
    query ConcreteNotification($id: Int!) {
        concrete_notification(concreteNotificationId: $id) {
            id
            message {
                headline
                body
                modalText
                type
            }
            sentAt
        }
    }
`);

export const useConcreteNotification = (id: number) => {
    const { data, loading, error } = useQuery(concreteNotificationQuery, {
        variables: { id },
        skip: !id,
    });
    const [concreteNotification, setConcreteNotification] = useState<Concrete_Notification | null>(null);

    useEffect(() => {
        if (!loading && !error && isMessageValid(data?.concrete_notification?.message)) {
            setConcreteNotification(data?.concrete_notification as Concrete_Notification);
        }
    }, [loading, data, error]);

    return concreteNotification;
};
