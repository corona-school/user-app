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
  }
}
export default notification
