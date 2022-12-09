import { ReactElement } from 'react'
import { DateTime } from 'luxon'
import { TOptions } from 'i18next'
import {
  marketingNotificationPreference,
  messageIcons,
  systemNotificationPreference
} from './notification-preferences'
import { MessageType, UserNotification } from '../types/lernfair/Notification'

function getIconForMessageType(messageType: string): ReactElement {
  const messageIcon: JSX.Element = messageIcons[messageType]
  return messageIcon
}

const getNotificationPreferencesData = (category: string) => {
  const systemPreferences = systemNotificationPreference[category]
  const marketingPreferences = marketingNotificationPreference[category]
  return { systemPreferences, marketingPreferences }
}

const getTimeDifference = (timestring: string) => {
  const now = DateTime.now()
  const createdAt = DateTime.fromISO(timestring)
  const timeDiff = now.diff(createdAt, 'minutes')
  const minutesDiff = now.diff(createdAt, 'minutes').minutes
  const hoursDiff = now.diff(createdAt, 'hours').hours
  const daysDiff = now.diff(createdAt, 'days').days
  const weeksDiff = now.diff(createdAt, 'weeks').weeks
  const timeDiffString = timeDiff.toFormat('m')

  return { minutesDiff, hoursDiff, daysDiff, weeksDiff, timeDiffString }
}

type TimeText = { text: string; options?: TOptions }

const getTimeText = (timestring: string): TimeText | string => {
  const diff = getTimeDifference(timestring)
  const minutes = diff.minutesDiff
  const days = diff.daysDiff
  const timeAsString = DateTime.fromISO(timestring).toFormat('T')

  if (minutes < 1) {
    return { text: 'notification.timedifference.now' }
  } else if (minutes < 60) {
    return {
      text: 'notification.timedifference.beforeMinutes',
      options: {
        minutes: diff.timeDiffString
      }
    }
  } else if (minutes > 60) {
    if (days > 2) {
      return { text: 'notification.timedifference.dayBeforeYesterday' }
    }

    if (days > 1) {
      return { text: 'notification.timedifference.yesterday' }
    }

    return timeAsString
  }
  return timeAsString
}

const isNewNotification = (sentAt: string, lastOpen: string) => {
  if (sentAt > lastOpen) {
    return false
  } else if (sentAt < lastOpen) {
    return true
  }
}

const getNewNotifications = (
  userNotifications: UserNotification[],
  lastTimeChecked: string
) => {
  const newNotifications = userNotifications.filter(
    notification =>
      new Date(notification.sentAt).getTime() >
      new Date(lastTimeChecked).getTime()
  )
  return newNotifications
}

const getAllNewUserNotificationsButMinimumFiveNotifications = (
  userNotifications: UserNotification[],
  lastTimeChecked: string
) => {
  const userNotificationsToRender = getNewNotifications(
    userNotifications,
    lastTimeChecked
  )

  if (userNotifications.length < 5) {
    return userNotifications
  } else {
    for (let i = userNotificationsToRender.length; i < 5; i++) {
      userNotificationsToRender.push(userNotifications[i])
    }
  }

  return userNotificationsToRender
}

export {
  getIconForMessageType,
  getNotificationPreferencesData,
  getTimeText,
  isNewNotification,
  getNewNotifications,
  getAllNewUserNotificationsButMinimumFiveNotifications
}
