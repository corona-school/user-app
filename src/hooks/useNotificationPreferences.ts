import {
    getMarketingNotificationPreferenceCategories,
    getSystemNotificationPreferenceCategories,
    marketingNotificationCategories,
    systemNotificationCategories,
} from '@/helper/notification-preferences';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { NotificationPreferences, PreferencesType } from '../types/lernfair/NotificationPreferences';
import { getAllPreferencesInCategorySetToValue } from '@/helper/notification-helper';

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

    const updateUserPreference = (category: string, value: PreferencesType) => {
        const preferences = { ...userPreferences, [category]: value };
        return updateUserPreferences(preferences);
    };

    const updateUserPreferences = (preferences: NotificationPreferences) => {
        return mutateUserPreferences({
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
            const preferences = data?.me?.notificationPreferences;
            setUserPreferencesPrivate(preferences);
        }
    }, [loading, error, data?.me?.notificationPreferences]);

    const currentSystemPreferences = Object.entries(userPreferences).filter(([key]) => getSystemNotificationPreferenceCategories().includes(key));
    const currentMarketingPreferences = Object.entries(userPreferences).filter(([key]) => getMarketingNotificationPreferenceCategories().includes(key));

    const hasPushSystemNotificationsEnabled = currentSystemPreferences.every(([key, value]) => {
        return value.push === true;
    });

    const hasSystemPreferencesEnabled = currentSystemPreferences.every(([key, value]) => {
        return value.email === true || value.push === true;
    });
    const hasMarketingPreferencesEnabled = currentMarketingPreferences.every(([key, value]) => {
        return value.email === true || value.push === true;
    });

    const toggleSystemNotifications = (value: boolean) => {
        updateUserPreferences(getAllPreferencesInCategorySetToValue(userPreferences, value, systemNotificationCategories, ['email', 'push']));
    };

    const toggleMarketingNotifications = (value: boolean) => {
        updateUserPreferences(getAllPreferencesInCategorySetToValue(userPreferences, value, marketingNotificationCategories, ['email', 'push']));
    };

    return {
        hasSystemPreferencesEnabled,
        hasMarketingPreferencesEnabled,
        hasPushSystemNotificationsEnabled,
        userPreferences,
        updateUserPreference,
        updateUserPreferences,
        toggleSystemNotifications,
        toggleMarketingNotifications,
    };
};

export { useUserPreferences };
