import { MessageType } from '../types/lernfair/Notification'
import SettingsIcon from '../assets/icons/lernfair/ico-settings.svg'
import BellIcon from '../assets/icons/lernfair/lf-bell.svg'
import { ReactElement } from 'react'

function getIconForCategory(messageType: string): ReactElement {
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

export { getIconForCategory }
