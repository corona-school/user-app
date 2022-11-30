import IconMessage from '../../../assets/icons/lernfair/notifications/Icon_Message.svg'
import IconMatch from '../../../assets/icons/lernfair/notifications/Icon_Match.svg'
import IconAppointment from '../../../assets/icons/lernfair/notifications/Icon_Appointment.svg'
import IconCourse from '../../../assets/icons/lernfair/notifications/Icon_Course.svg'
import IconNews from '../../../assets/icons/lernfair/notifications/Icon_News.svg'
import IconSurvey from '../../../assets/icons/lernfair/notifications/Icon_Survey.svg'
import IconMessageModal from '../../../assets/icons/lernfair/notifications/Ic_Message.svg'
import IconMatchModal from '../../../assets/icons/lernfair/notifications/Ic_Match.svg'
import IconCourseModal from '../../../assets/icons/lernfair/notifications/Ic_Course.svg'
import IconAppointmentModal from '../../../assets/icons/lernfair/notifications/Ic_Appointment.svg'
import IconSurveyModal from '../../../assets/icons/lernfair/notifications/Ic_Survey.svg'
import IconNewsModal from '../../../assets/icons/lernfair/notifications/Ic_News.svg'

export type Preferences = {
  id: number
  title: string
  icon: JSX.Element
  modal: ModalInformation
}

export type ModalInformation = {
  body: string
  icon: JSX.Element
}

export const preferencesData: Preferences[] = [
  {
    id: 1,
    title: 'Chat-Nachrichten',
    icon: <IconMessage />,
    modal: {
      body: 'Hier geht es um die Chat-Nachrichten, die du von Kurslehrer:innen oder auch Kursteilnehmer:innen erhältst.',
      icon: <IconMessageModal />
    }
  },
  {
    id: 2,
    title: 'Matches & Informationen zur Zordnung',
    icon: <IconMatch />,
    modal: {
      body: 'Wir möchten dich informieren, wenn wir eine geeignete Person für dich gefunden haben und halten dich über den Status deiner Zuordnung auf dem Laufenden. Außerdem fragen wir gelegentlich mal nach, ob du mit deiner Zuordnung zufrieden bist.',
      icon: <IconMatchModal />
    }
  },
  {
    id: 3,
    title: 'Lehrinformationen & Zertifikate',
    icon: <IconCourse />,
    modal: {
      body: 'Wir möchten dich über wichtige Informationen rund um dein Lernangebot informieren.Wir benachrichtigen dich, wenn du eine Anmeldung erfolgreich abgeschlossen hast, wir noch eine Bestätigung von dir benötigen oder wenn ein Zertifikat zum Download bereitsteht.',
      icon: <IconCourseModal />
    }
  },
  {
    id: 4,
    title: 'Terminhinweise',
    icon: <IconAppointment />,
    modal: {
      body: 'Bevor ein Termin beginnt, zu dem du dich angemeldet hast, möchten wir dir gerne eine Erinnerung schicken. Dies kann zum Beispiel kurz vor einem Kursbeginn geschehen.',
      icon: <IconAppointmentModal />
    }
  },
  {
    id: 5,
    title: 'Feedback & Befragungen',
    icon: <IconSurvey />,
    modal: {
      body: 'Wir möchten, dass du zufrieden mit Lern Fair bist. Wir fragen deshalb hin und wieder bei dir nach, ob du zufrieden bist oder ob etwas besser laufen könnte..',
      icon: <IconSurveyModal />
    }
  },
  {
    id: 6,
    title: 'Neue Funktionen & Features',
    icon: <IconNews />,
    modal: {
      body: 'Wir sind stetig dabei, unser Angebot zu verbessern und entwickeln unsere Plattform weiter. Wir möchten dich gerne über neue Features und Funktionen informieren.',
      icon: <IconNewsModal />
    }
  }
]
