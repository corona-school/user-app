import { MessageType, UserNotification } from '../types/lernfair/Notification'
import MessageIcon from '../assets/icons/lernfair/notifications/lf_message.svg'
import MatchIcon from '../assets/icons/lernfair/notifications/lf_match.svg'
import CourseIcon from '../assets/icons/lernfair/notifications/lf_course.svg'
import AppointmentIcon from '../assets/icons/lernfair/notifications/lf_appointment.svg'
import SurveyIcon from '../assets/icons/lernfair/notifications/lf_survey.svg'
import NewsIcon from '../assets/icons/lernfair/notifications/lf_news.svg'
import { ReactElement } from 'react'
import { DateTime } from 'luxon'
import { TOptions } from 'i18next'

function getIconForMessageType(messageType: string): ReactElement {
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
    default:
      return <MatchIcon />
  }
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
  getTimeText,
  isNewNotification,
  getNewNotifications,
  getAllNewUserNotificationsButMinimumFiveNotifications
}
