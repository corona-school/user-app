import { NotificationType } from '../types/lernfair/Notification'
import SettingsIcon from '../assets/icons/lernfair/ico-settings.svg'
import BellIcon from '../assets/icons/lernfair/lf-bell.svg'
import { ReactElement } from 'react'

// TO DO: fill with notification types
function getIconForCategory(iconCategory: NotificationType): ReactElement {
  switch (iconCategory) {
    case NotificationType.SURVEY:
      return <SettingsIcon />
    case NotificationType.TRANSACTION:
      return <BellIcon />
    default:
      throw new Error(`No Icon for this category ${iconCategory} found.`)
  }
}

export { getIconForCategory }
