import { gql, useMutation, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { NotificationPreferences } from '../types/lernfair/NotificationPreferences';

const notificationPreferencesQuery = gql`
    query GetNotificationPreferences {
        me {
            notificationPreferences
        }
    }
`;

const notificationPreferencesMutation = gql`
    mutation changeMeNotificationPref($preferences: PreferencesInput!) {
        meUpdate(update: { notificationPreferences: $preferences })
    }
`;

const useUserPreferences = () => {
    const [userPreferences, setUserPreferencesPrivate] = useState<NotificationPreferences>({});

    const { data, loading, error } = useQuery(notificationPreferencesQuery);

    const [mutateUserPreferences] = useMutation(notificationPreferencesMutation);

    const updateUserPreference = (category: string, channel: string, value: boolean) => {
        const preferences = { ...userPreferences, [category]: { [channel]: value } };
        updateUserPreferences(preferences);
    };

    const updateUserPreferences = (preferences: NotificationPreferences) => {
        mutateUserPreferences({
            variables: {
                preferences,
            },
            optimisticResponse: { meUpdate: true },
        }).then((value) => {
            if (value?.data?.meUpdate) setUserPreferencesPrivate(preferences);
        });
    };

    useEffect(() => {
        if (!loading && !error && data?.me?.notificationPreferences) {
            const userPreferences = data?.me?.notificationPreferences;
            const preferences = userPreferences;
            setUserPreferencesPrivate(preferences);
        }
    }, [loading, error, data?.me?.notificationPreferences]);
    return {
        userPreferences,
        updateUserPreference,
        updateUserPreferences,
    };
};

export { useUserPreferences };
