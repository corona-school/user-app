const notification = {
  timedifference: {
    yesterday: 'Gestern',
    dayBeforeYesterday: 'Vorgestern',
    lastWeek: 'letzte Woche',
    lastMonth: 'letzten Monat',
    now: 'gerade eben',
    beforeMinutes: '{{minutes}} Min'
  },
  panel: {
    button: {
      text: 'Ältere Benachrichtigungen anzeigen'
    }
  },
  controlPanel: {
    title: 'E-Mail-Benachrichtigungen',
    preference: {
      chat: {
        title: 'Chat-Nachrichten',
        modalBody:
          'Hier geht es um die Chat-Nachrichten, die du von Kurslehrer:innen oder auch Kursteilnehmer:innen erhältst.'
      },
      match: {
        title: 'Matches & Informationen zur Zordnung',
        modalBody:
          'Wir möchten dich informieren, wenn wir eine geeignete Person für dich gefunden haben und halten dich über den Status deiner Zuordnung auf dem Laufenden. Außerdem fragen wir gelegentlich mal nach, ob du mit deiner Zuordnung zufrieden bist.'
      },
      course: {
        title: 'Lehrinformationen & Zertifikate',
        modalBody:
          'Wir möchten dich über wichtige Informationen rund um dein Lernangebot informieren.Wir benachrichtigen dich, wenn du eine Anmeldung erfolgreich abgeschlossen hast, wir noch eine Bestätigung von dir benötigen oder wenn ein Zertifikat zum Download bereitsteht.'
      },
      appointment: {
        title: 'Terminhinweise',
        modalBody:
          'Bevor ein Termin beginnt, zu dem du dich angemeldet hast, möchten wir dir gerne eine Erinnerung schicken. Dies kann zum Beispiel kurz vor einem Kursbeginn geschehen.'
      },
      survey: {
        title: 'Feedback & Befragungen',
        modalBody:
          'Wir möchten, dass du zufrieden mit Lern Fair bist. Wir fragen deshalb hin und wieder bei dir nach, ob du zufrieden bist oder ob etwas besser laufen könnte..'
      },
      news: {
        title: 'Neue Funktionen & Features',
        modalBody:
          'Wir sind stetig dabei, unser Angebot zu verbessern und entwickeln unsere Plattform weiter. Wir möchten dich gerne über neue Features und Funktionen informieren.'
      }
    },
    tabs: {
      tab1: {
        title: 'System',
        description:
          'Systembenachrichtigungen werden dir jeweils innerhalb der App (an der Glocke im Header) angezeigt. Hier kannst du einstellen, ob du zusätzlich per Mail benachrichtigt werden möchtest.'
      },
      tab2: {
        title: 'Marketing'
      }
    }
  },
  closeButton: 'Schließen'
}
export default notification
