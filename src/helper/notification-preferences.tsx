import IconMessage from '../assets/icons/lernfair/notifications/Icon_Message.svg'
import IconMatch from '../assets/icons/lernfair/notifications/Icon_Match.svg'
import IconAppointment from '../assets/icons/lernfair/notifications/Icon_Appointment.svg'
import IconCourse from '../assets/icons/lernfair/notifications/Icon_Course.svg'
import IconNews from '../assets/icons/lernfair/notifications/Icon_News.svg'
import IconSurvey from '../assets/icons/lernfair/notifications/Icon_Survey.svg'

import MessageIcon from '../assets/icons/lernfair/notifications/lf_message.svg'
import MatchIcon from '../assets/icons/lernfair/notifications/lf_match.svg'
import CourseIcon from '../assets/icons/lernfair/notifications/lf_course.svg'
import AppointmentIcon from '../assets/icons/lernfair/notifications/lf_appointment.svg'
import SurveyIcon from '../assets/icons/lernfair/notifications/lf_survey.svg'
import NewsIcon from '../assets/icons/lernfair/notifications/lf_news.svg'

type PreferenceDataType = {
  [category: string]: {
    title: string
    icon?: JSX.Element
  }
}

type Icon = { [category: string]: JSX.Element }

export const systemNotificationPreference: PreferenceDataType = {
  chat: {
    title: 'notification.controlPanel.preference.chat.title',
    icon: <IconMessage />
  },
  match: {
    title: 'notification.controlPanel.preference.match.title',
    icon: <IconMatch />
  },
  course: {
    title: 'notification.controlPanel.preference.course.title',
    icon: <IconCourse />
  },
  appointment: {
    title: 'notification.controlPanel.preference.appointment.title',
    icon: <IconAppointment />
  },
  survey: {
    title: 'notification.controlPanel.preference.survey.title',
    icon: <IconSurvey />
  },
  news: {
    title: 'notification.controlPanel.preference.news.title',
    icon: <IconNews />
  }
}

export const marketingNotificationPreference: PreferenceDataType = {
  newsletter: {
    title: 'notification.controlPanel.preference.newsletter.title'
  },
  training: {
    title: 'notification.controlPanel.preference.training.title'
  },
  events: {
    title: 'notification.controlPanel.preference.events.title'
  },
  newsoffer: {
    title: 'notification.controlPanel.preference.newsoffer.title'
  },
  request: {
    title: 'notification.controlPanel.preference.request.title'
  },
  learnoffer: {
    title: 'notification.controlPanel.preference.learnoffer.title'
  },
  alternativeoffer: {
    title: 'notification.controlPanel.preference.alternativeoffer.title'
  },
  feedback: {
    title: 'notification.controlPanel.preference.feedback.title'
  }
}

export const messageIcons: Icon = {
  message: <MessageIcon />,
  match: <MatchIcon />,
  course: <CourseIcon />,
  appointment: <AppointmentIcon />,
  survey: <SurveyIcon />,
  news: <NewsIcon />
}
