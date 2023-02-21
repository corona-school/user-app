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
        leavePageModal: {
            text: 'Du bist dabei Lernfair zu verlassen',
            description: 'Du wirst zu folgender Seite weitergeleitet',
            button: 'Weiter zu externer Seite',
        },
    },

    controlPanel: {
        title: 'E-Mail-Benachrichtigungen',
        closeButton: 'Schließen',
        preference: {
            enableAll: 'Alle Newsletter aktivieren',
            disableAll: 'Alle Newsletter deaktivieren',
            chat: {
                title: 'Chat-Nachrichten',
                modalBody: 'Wir schicken dir eine E-Mail für jede Chat-Nachricht, die du bekommst.',
            },
            survey: {
                title: 'Feedback & Befragungen',
                modalBody:
                    'Wir möchten, dass du zufrieden mit Lern Fair bist. Deshalb schicken wir dir gelegentlich Feedback-Fragebögen zu, um von deinen Erfahrungen zu hören. Wir freuen uns, wenn du Feedback, Ideen und Verbesserungsvorschläge auf diesem Wege an uns weiterleitest.',
            },
            appointment: {
                title: 'Terminhinweis',
                modalBody:
                    'Wir informieren dich über neue Termine mit deinen Lernpartner:innen und in Kursen. Zudem erinnern wir dich kurz vor Beginn des Termins nochmal an die Unterrichtsstunde.',
            },
            advice: {
                title: 'Lerntipps & Hilfestellungen',
                modalBody:
                    'Lernen muss gelernt sein. Wir helfen dir mit Schulungen und Materialien, dich auf die Unterrichtsstunden vorzubereiten und senden dir zugleich die besten Tipps für einen möglichst großen Lernfortschritt. Damit bleibt ihr motiviert und spart wertvolle Zeit.',
            },
            suggestion: {
                title: 'Kursvorschläge',
                modalBody:
                    'Auf unserer Plattform laden wir regelmäßig neue spannende Kurse hoch. Wenn ein passender Kurs für deine Jahrgangsstufe und deine Fächer angeboten wird, erhältst du von uns eine Benachrichtigung. Du kannst deine Fächer und damit deine Interessen im Profil jederzeit anpassen.',
            },
            announcement: {
                title: 'Wichtige Änderungen',
                modalBody:
                    'Wenn sich die Funktionsweise von Lern-Fair wesentlich ändert oder es neue Programme gibt, informieren wir dich über wichtige Änderungen.',
            },
            call: {
                title: 'Aufruf zum Engagement',
                modalBody:
                    'Wir informieren dich, wenn es zu einem Zeitpunkt besonders viel Unterstützungsbedarf gibt und erklären dir, wie du dich am besten für mehr Bildungsgerechtigkeit bei uns einsetzen kannst.',
            },
            news: {
                title: 'Neuigkeiten von Lern-Fair',
                modalBody:
                    'Wir möchten dich gerne über neue Features und Funktionen informieren und dich auf Vorteile aufmerksam machen, die du über Lern-Fair erhalten kannst.',
            },
            event: {
                title: 'Events & Happenings',
                modalBody:
                    'Bei Lern-Fair organisieren wir regelmäßig coole Events und wertvolle Fortbildungen. Wir halten dich auf dem Laufenden und vernetzen dich mit anderen Nutzer:innen auf unserer Plattform.',
            },
            request: {
                title: 'Gesuch',
                modalBody:
                    'Für Interviews, Pressebeiträge oder lokale Aktionen suchen wir manchmal Helfer:innen und Schüler:innen, die bei Lern-Fair mitmachen und von ihren Erfahrungen berichten möchten. Darüber hinaus suchen wir Testpersonen für unsere App, unsere Website oder ein neues Programm von uns.',
            },
            alternative: {
                title: 'Hinweise zu Alternativangeboten',
                modalBody:
                    'Lern-Fair ist eine super Unterstützungsmöglichkeit für Schüler:innen. Es gibt aber auch viele andere hilfreiche Programme, nützliche Apps oder soziale Organisationen. Falls wir etwas Passendes für dich finden, benachrichtigen wir dich und hoffen, dass du von dem Angebot profitieren kannst.',
            },
        },
        tabs: {
            system: {
                title: 'System',
                description:
                    'Systembenachrichtigungen werden dir jeweils innerhalb der App (an der Glocke im Header) angezeigt. Hier kannst du einstellen, ob du zusätzlich per Mail benachrichtigt werden möchtest.',
            },
            newsletter: {
                title: 'Newsletter',
                description: 'Newsletter werden ausschließlich per Mail versendet.\nHier kannst du einstellen welche Arten von Mails du erhalten möchtest.',
            },
        },
    },
};
export default notification;
