import { MessageType } from '../types/lernfair/Notification'
import SettingsIcon from '../assets/icons/lernfair/ico-settings.svg'
import BellIcon from '../assets/icons/lernfair/lf-bell.svg'
import { ReactElement } from 'react'
import { DateTime } from 'luxon'
import { TOptions } from 'i18next'

function getIcon(messageType: string): ReactElement {
  switch (messageType) {
    case MessageType.SURVEY:
      return <SettingsIcon />
    case MessageType.TRANSACTION:
      return <BellIcon />
    case MessageType.TYP1:
      return <BellIcon />
    case MessageType.TYP2:
      return <BellIcon />
    case MessageType.TYP3:
      return <BellIcon />
    case MessageType.TYP4:
      return <BellIcon />
    case MessageType.TYP5:
      return <BellIcon />
    case MessageType.TYP6:
      return <BellIcon />
    case MessageType.TYP7:
      return <BellIcon />
    case MessageType.TYP8:
      return <BellIcon />
    case MessageType.TYP9:
      return <BellIcon />
    case MessageType.TYP10:
      return <BellIcon />
    default:
      throw new Error(`No Icon for this category ${messageType} found.`)
  }
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
export { getIcon, getTimeText }
