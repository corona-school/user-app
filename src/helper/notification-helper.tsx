import { NotificationType } from '../types/lernfair/Notification'
import SettingsIcon from '../assets/icons/lernfair/ico-settings.svg'
import BellIcon from '../assets/icons/lernfair/lf-bell.svg'
import { ReactElement } from 'react'
import { DateTime } from 'luxon'

// TO DO
function getIconForCategory(iconCategory: string): ReactElement {
  switch (iconCategory) {
    case NotificationType.SURVEY:
      return <SettingsIcon />
    case NotificationType.TRANSACTION:
      return <BellIcon />
    case 'NotificationClass0':
      return <SettingsIcon />
    case 'NotificationClass1':
      return <SettingsIcon />
    case 'NotificationClass2':
      return <SettingsIcon />
    case 'NotificationClass3':
      return <SettingsIcon />
    case 'NotificationClass4':
      return <SettingsIcon />
    case 'NotificationClass5':
      return <SettingsIcon />
    case 'NotificationClass6':
      return <SettingsIcon />
    case 'NotificationClass7':
      return <SettingsIcon />
    case 'NotificationClass8':
      return <SettingsIcon />
    case 'NotificationClass9':
      return <SettingsIcon />
    case 'NotificationClass10':
      return <SettingsIcon />
    default:
      throw new Error(`No Icon for this category ${iconCategory} found.`)
  }
}

const getTimeDifference = (timestamp: string) => {
  const now = DateTime.now()
  const createdAt = DateTime.fromISO(timestamp)

  const diffTime = now.diff(createdAt, 'minutes') //minuten vergangen
  const diffInMin = diffTime.minutes

  const createdAtAsTime = DateTime.fromISO(timestamp).toFormat('T')
  const diffAsString = diffTime.toFormat('m')

  if (diffInMin < 60) {
    return `vor ${diffAsString} min`
  } else if (diffInMin > 60) {
    if (diffInMin > 1440) {
      return 'gestern'
    }
    return createdAtAsTime
  }
}

export { getIconForCategory, getTimeDifference }
