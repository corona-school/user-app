import IconMessage from '../../../assets/icons/lernfair/notifications/Icon_Message.svg'
import IconMatch from '../../../assets/icons/lernfair/notifications/Icon_Match.svg'
import IconAppointment from '../../../assets/icons/lernfair/notifications/Icon_Appointment.svg'
import IconCourse from '../../../assets/icons/lernfair/notifications/Icon_Course.svg'
import IconNews from '../../../assets/icons/lernfair/notifications/Icon_News.svg'
import IconSurvey from '../../../assets/icons/lernfair/notifications/Icon_Survey.svg'

export const preferencesData = [
  {
    id: 1,
    title: 'Chat-Nachrichten',
    icon: <IconMessage />
  },
  {
    id: 2,
    title: 'Matches & Informationen zur Zordnung',
    icon: <IconMatch />
  },
  {
    id: 3,
    title: 'Lehrinformationen & Zertifikate',
    icon: <IconCourse />
  },
  {
    id: 4,
    title: 'Terminhinweise',
    icon: <IconAppointment />
  },
  {
    id: 5,
    title: 'Feedback & Befragungen',
    icon: <IconSurvey />
  },
  {
    id: 6,
    title: 'Neue Funktionen & Features',
    icon: <IconNews />
  }
]
