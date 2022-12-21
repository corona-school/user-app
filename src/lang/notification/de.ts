const notification = {
    timedifference: {
        yesterday: 'Gestern',
        dayBeforeYesterday: 'Vorgestern',
        lastWeek: 'letzte Woche',
        lastMonth: 'letzten Monat',
        now: 'gerade eben',
        beforeMinutes: '{{minutes}} Min',
    },
    panel: {
        noNotifications: 'Keine Nachrichten vorhanden.',
        button: {
            text: 'Ältere Benachrichtigungen anzeigen',
        },
    },
    controlPanel: {
        title: 'E-Mail-Benachrichtigungen',
        preference: {
            chat: { title: 'Chat-Nachrichten' },
            match: { title: 'Matches & Informationen zur Zordnung' },
            course: { title: 'Lehrinformationen & Zertifikate' },
            appointment: { title: 'Terminhinweise' },
            survey: { title: 'Feedback & Befragungen' },
            news: { title: 'Neue Funktionen & Features' },
            newsletter: { title: 'Newsletter' },
            training: { title: 'Fortbildungen & Hilfsmaterial' },
            events: { title: 'Events & Social Happenings' },
            newsoffer: { title: 'Neuigkeiten über Angebot und Platform' },
            request: { title: 'Gesuchen' },
            learnoffer: { title: 'Hinweise zum Lernangebot' },
            alternativeoffer: { title: 'Hinweise zu Alternativangeboten' },
            feedback: { title: 'Feedback und Befragungen' },
        },
        tabs: {
            system: {
                title: 'System',
                description:
                    'Systembenachrichtigungen werden dir jeweils innerhalb der App (an der Glocke im Header) angezeigt. Hier kannst du einstellen, ob du zusätzlich per Mail benachrichtigt werden möchtest.',
            },
            marketing: {
                title: 'Marketing',
                description:
                    'Marketing-Benachrichtigung werden ausschließlich per Mail versendet.\nHier kannst du einstellen welche Arten von Mails du erhalten möchtest.',
            },
        },
    },
};
export default notification;
