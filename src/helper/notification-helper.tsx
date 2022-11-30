import { NotiType, MessageType } from '../types/lernfair/Notification'
import BellIcon from '../assets/icons/lernfair/lf-bell.svg'
import MessageIcon from '../assets/icons/lernfair/notifications/lf_message.svg'
import MatchIcon from '../assets/icons/lernfair/notifications/lf_match.svg'
import CourseIcon from '../assets/icons/lernfair/notifications/lf_course.svg'
import AppointmentIcon from '../assets/icons/lernfair/notifications/lf_appointment.svg'
import SurveyIcon from '../assets/icons/lernfair/notifications/lf_survey.svg'
import NewsIcon from '../assets/icons/lernfair/notifications/lf_news.svg'

import IconMessage from '../assets/icons/lernfair/notifications/Icon_Message.svg'
import IconMatch from '../assets/icons/lernfair/notifications/Icon_Match.svg'
import IconAppointment from '../assets/icons/lernfair/notifications/Icon_Appointment.svg'
import IconCourse from '../assets/icons/lernfair/notifications/Icon_Course.svg'
import IconNews from '../assets/icons/lernfair/notifications/Icon_News.svg'
import IconSurvey from '../assets/icons/lernfair/notifications/Icon_Survey.svg'

import IconMessageModal from '../assets/icons/lernfair/notifications/Ic_Message.svg'
import IconMatchModal from '../assets/icons/lernfair/notifications/Ic_Match.svg'
import IconCourseModal from '../assets/icons/lernfair/notifications/Ic_Course.svg'
import IconAppointmentModal from '../assets/icons/lernfair/notifications/Ic_Appointment.svg'
import IconSurveyModal from '../assets/icons/lernfair/notifications/Ic_Survey.svg'
import IconNewsModal from '../assets/icons/lernfair/notifications/Ic_News.svg'

import { ReactElement } from 'react'
import { DateTime } from 'luxon'
import { TOptions } from 'i18next'
// TODO delete NotiType Typen
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
      throw new Error(`No Icon for this category ${messageType} found.`)
  }
}

type NotificationPreference = { title: string; icon: JSX.Element; modal: Modal }
type Modal = { body: string; icon: JSX.Element }

const getDataForNotificationPreference = (
  notificationPreference: string
): NotificationPreference => {
  switch (notificationPreference) {
    case MessageType.CHAT:
      return {
        title: 'notification.controlPanel.preference.chat.title',
        icon: <IconMessage />,
        modal: {
          body: 'notification.controlPanel.preference.chat.modalBody',
          icon: <IconMessageModal />
        }
      }
    case MessageType.MATCH:
      return {
        title: 'notification.controlPanel.preference.match.title',
        icon: <IconMatch />,
        modal: {
          body: 'notification.controlPanel.preference.match.modalBody',
          icon: <IconMatchModal />
        }
      }
    case MessageType.COURSE:
      return {
        title: 'notification.controlPanel.preference.course.title',
        icon: <IconCourse />,
        modal: {
          body: 'notification.controlPanel.preference.course.modalBody',
          icon: <IconCourseModal />
        }
      }
    case MessageType.APPOINTMENT:
      return {
        title: 'notification.controlPanel.preference.appointment.title',
        icon: <IconAppointment />,
        modal: {
          body: 'notification.controlPanel.preference.chat.modalBody',
          icon: <IconAppointmentModal />
        }
      }
    case MessageType.SURVEY:
      return {
        title: 'notification.controlPanel.preference.survey.title',
        icon: <IconSurvey />,
        modal: {
          body: 'notification.controlPanel.preference.chat.modalBody',
          icon: <IconSurveyModal />
        }
      }
    case MessageType.NEWS:
      return {
        title: 'notification.controlPanel.preference.news.title',
        icon: <IconNews />,
        modal: {
          body: 'notification.controlPanel.preference.chat.modalBody',
          icon: <IconNewsModal />
        }
      }
    default:
      return {
        title: 'notification.preference.chat.title',
        icon: <IconMessage />,
        modal: {
          body: 'notification.controlPanel.preference.chat.modalBody',
          icon: <IconMessageModal />
        }
      }
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
export { getIconForMessageType, getDataForNotificationPreference, getTimeText }
