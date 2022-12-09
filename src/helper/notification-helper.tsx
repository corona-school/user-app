import { ReactElement } from 'react'
import { DateTime } from 'luxon'
import { TOptions } from 'i18next'
import {
  marketingNotificationPreference,
  messageIcons,
  systemNotificationPreference
} from './notification-preferences'

function getIconForMessageType(messageType: string): ReactElement {
  const messageIcon: JSX.Element = messageIcons[messageType]
  return messageIcon
}

const getNotificationPreferencesData = (category: string) => {
  const systemPreferences = systemNotificationPreference[category]
  const marketingPreferences = marketingNotificationPreference[category]
  return { systemPreferences, marketingPreferences }
}

const getTimeDifference = (timestamp: string) => {
  const now = DateTime.now()
  const createdAt = DateTime.fromISO(timestamp)
  const timeDiff = now.diff(createdAt, 'minutes')
  const minutesDiff = now.diff(createdAt, 'minutes').minutes
  const hoursDiff = now.diff(createdAt, 'hours').hours
  const daysDiff = now.diff(createdAt, 'days').days
  const weeksDiff = now.diff(createdAt, 'weeks').weeks
  const timeDiffString = timeDiff.toFormat('m')

  return { minutesDiff, hoursDiff, daysDiff, weeksDiff, timeDiffString }
}

type TimeText = { text: string; options?: TOptions }

const getTimeText = (timestamp: string): TimeText | string => {
  const diff = getTimeDifference(timestamp)
  const minutes = diff.minutesDiff
  const days = diff.daysDiff
  const timeAsString = DateTime.fromISO(timestamp).toFormat('T')

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
export { getIconForMessageType, getNotificationPreferencesData, getTimeText }
