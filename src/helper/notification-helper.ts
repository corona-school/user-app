import { DateTime } from 'luxon';
import { TOptions } from 'i18next';
import {
    getAllNotificationPreferenceCategories,
    marketingNotificationCategories,
    messageIcons,
    modalIcons,
    NotificationCategories,
    systemNotificationCategories,
} from './notification-preferences';
import { FC } from 'react';
import { NotificationPreferences } from '../types/lernfair/NotificationPreferences';
import { Concrete_Notification, NotificationMessage } from '../gql/graphql';

const getIconForMessageType = (messageType: string): FC => (messageIcons.hasOwnProperty(messageType) ? messageIcons[messageType] : () => null);
const getIconForNotificationPreferenceModal = (messageType: string): FC => {
    return modalIcons.hasOwnProperty(messageType) ? modalIcons[messageType] : () => null;
};

const getTimeDifference = (timestamp: string) => {
    const now = DateTime.now();
    const createdAt = DateTime.fromISO(timestamp);
    const timeDiff = now.diff(createdAt, 'minutes');
    const minutesDiff = now.diff(createdAt, 'minutes').minutes;
    const hoursDiff = now.diff(createdAt, 'hours').hours;
    const daysDiff = now.diff(createdAt, 'days').days;
    const weeksDiff = now.diff(createdAt, 'weeks').weeks;
    const timeDiffString = timeDiff.toFormat('m');

    return { minutesDiff, hoursDiff, daysDiff, weeksDiff, timeDiffString };
};

type PossibleTextConstants =
    | 'notification.timedifference.now'
    | 'notification.timedifference.beforeMinutes'
    | 'notification.timedifference.dayBeforeYesterday'
    | 'notification.timedifference.yesterday';

type TimeText = { text: PossibleTextConstants; options?: TOptions };

const getTimeText = (timestring: string): TimeText | string => {
    const diff = getTimeDifference(timestring);
    const minutes = diff.minutesDiff;
    const days = diff.daysDiff;
    const timeAsString = DateTime.fromISO(timestring).toFormat('T');

    if (minutes < 1) {
        return { text: 'notification.timedifference.now' };
    } else if (minutes < 60) {
        return {
            text: 'notification.timedifference.beforeMinutes',
            options: {
                minutes: diff.timeDiffString,
            },
        };
    } else if (minutes > 60) {
        if (days > 2) {
            return { text: 'notification.timedifference.dayBeforeYesterday' };
        }

        if (days > 1) {
            return { text: 'notification.timedifference.yesterday' };
        }

        return timeAsString;
    }
    return timeAsString;
};

const isNewNotification = (sentAt: string, lastOpen: string) => {
    if (sentAt > lastOpen) {
        return false;
    } else if (sentAt < lastOpen) {
        return true;
    }
};

const getNewNotifications = (userNotifications: Concrete_Notification[], lastTimeChecked: string) => {
    const newNotifications = userNotifications.filter((notification) => new Date(notification.sentAt).getTime() > new Date(lastTimeChecked).getTime());
    return newNotifications;
};

const getAllNewUserNotificationsButMinimumFiveNotifications = (userNotifications: Concrete_Notification[], lastTimeChecked: string) => {
    const userNotificationsToRender = getNewNotifications(userNotifications, lastTimeChecked);

    if (userNotifications.length < 5) {
        return userNotifications;
    } else {
        for (let i = userNotificationsToRender.length; i < 5; i++) {
            userNotificationsToRender.push(userNotifications[i]);
        }
    }

    return userNotificationsToRender;
};

const getNotificationCategoriesData = (category: string) => {
    const all = getAllNotificationPreferenceCategories();
    const allPrefs = { ...systemNotificationCategories, ...marketingNotificationCategories };
    const systemPreferences = systemNotificationCategories[category];
    const marketingPreferences = marketingNotificationCategories[category];
    return { systemPreferences, marketingPreferences, all, allPrefs };
};

const getAllPreferencesInCategorySetToValue = (
    preferences: NotificationPreferences,
    value: boolean,
    categories: NotificationCategories,
    channels: string[]
): NotificationPreferences => {
    const newPreferences: NotificationPreferences = getPreferencesCopy(preferences);
    Object.keys(categories).forEach((category: string) => {
        if (!newPreferences.hasOwnProperty(category)) newPreferences[category] = {};
        channels.forEach((channel: string) => (newPreferences[category][channel] = value));
    });

    return newPreferences;
};

const getPreferencesCopy = (preferences: NotificationPreferences): NotificationPreferences => JSON.parse(JSON.stringify(preferences));

const isMessageValid = (message: NotificationMessage | null | undefined): boolean => {
    if (!message) return false;

    const requiredFields = ['headline', 'body'];
    const fields = Object.keys(message);

    for (const requiredField of requiredFields) {
        if (!fields.includes(requiredField)) return false;
    }

    return true;
};

export {
    getIconForMessageType,
    getIconForNotificationPreferenceModal,
    getTimeDifference,
    getTimeText,
    isNewNotification,
    getNewNotifications,
    getAllNewUserNotificationsButMinimumFiveNotifications,
    getNotificationCategoriesData,
    getAllPreferencesInCategorySetToValue,
    isMessageValid,
};
