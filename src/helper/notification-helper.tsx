import { NotiType, MessageType } from '../types/lernfair/Notification'
import BellIcon from '../assets/icons/lernfair/lf-bell.svg'
import MessageIcon from '../assets/icons/lernfair/notifications/lf_message.svg'
import MatchIcon from '../assets/icons/lernfair/notifications/lf_match.svg'
import CourseIcon from '../assets/icons/lernfair/notifications/lf_course.svg'
import AppointmentIcon from '../assets/icons/lernfair/notifications/lf_appointment.svg'
import SurveyIcon from '../assets/icons/lernfair/notifications/lf_survey.svg'
import NewsIcon from '../assets/icons/lernfair/notifications/lf_news.svg'
import { ReactElement } from 'react'
import { DateTime } from 'luxon'
import { TOptions } from 'i18next'

// TODO delete NotiType Typen
function getIcon(messageType: string): ReactElement {
  switch (messageType) {
    case MessageType.MESSAGE:
      return <MessageIcon />
    case MessageType.MATCH:
      return <MatchIcon />
    case MessageType.COURSE:
      return <CourseIcon />
    case MessageType.APPOINTMENT:
      return <AppointmentIcon />
    case MessageType.SURVEY:
      return <SurveyIcon />
    case MessageType.NEWS:
      return <NewsIcon />

    case NotiType.TYP1:
      return <MessageIcon />
    case NotiType.TYP2:
      return <MatchIcon />
    case NotiType.TYP3:
      return <CourseIcon />
    case NotiType.TYP4:
      return <AppointmentIcon />
    case NotiType.TYP5:
      return <SurveyIcon />
    case NotiType.TYP6:
      return <BellIcon />
    case NotiType.TYP7:
      return <NewsIcon />
    case NotiType.TYP8:
      return <BellIcon />
    case NotiType.TYP9:
      return <BellIcon />
    case NotiType.TYP10:
      return <BellIcon />
    default:
      return <MatchIcon />
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
