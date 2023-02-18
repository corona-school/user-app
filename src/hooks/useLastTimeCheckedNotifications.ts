import { gql, useMutation, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';

const getLastTimeCheckedQuery = gql`
    query {
        me {
            lastTimeCheckedNotifications
        }
    }
`;
const meLastTimeCheckedNotifications = gql`
    mutation updateMeLastTime($lastTimeCheckedNotifications: DateTime) {
        meUpdate(update: { lastTimeCheckedNotifications: $lastTimeCheckedNotifications })
    }
`;

export const useLastTimeCheckedNotifications = () => {
    const [lastTimeCheckedNotifications, setLastTimeCheckedNotifications] = useState('');
    // query only executes once when lastTimeCheckedNotifications is empty
    const { data, loading, error } = useQuery(getLastTimeCheckedQuery, { skip: lastTimeCheckedNotifications !== '' });

    const [updateLastTimeCheckedNotifications] = useMutation(meLastTimeCheckedNotifications);

    const updateLastTimeChecked = () => {
        const now = new Date().toISOString();
        updateLastTimeCheckedNotifications({
            variables: { lastTimeCheckedNotifications: now },
        }).then(() => setLastTimeCheckedNotifications(now));
    };

    useEffect(() => {
        if (!loading && !error && data?.me?.lastTimeCheckedNotifications) {
            setLastTimeCheckedNotifications(data?.me?.lastTimeCheckedNotifications);
        }
    }, [loading, data?.me?.lastTimeCheckedNotifications, error]);

    return {
        lastTimeCheckedNotifications,
        updateLastTimeChecked,
    };
};
