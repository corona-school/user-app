const dashboard = {
    appointmentcard: {
        header: 'Nächster Termin',

        card: {
            title: 'Mathe Grundlagen Klasse 6',
            content: 'In diesem Kurs gehen wir die Schritte einer Kurvendiskussion von Nullstellen über Extrema bis hin zu Wendepunkten durch.',
            url: '/',
            tags: ['hallo'],
        },
        hint: {
            pupil: 'Du kannst dem Videochat erst beitreten, wenn der:die Kursleiter:in das Meeting gestartet hat.',
            student: 'Du kannst das Meeting erst eine Stunde vor Beginn des Termins starten.',
        },
        meeting: {
            result: {
                success: 'Deine Video-Konferenz wurde erfolgreich eingetragen.',
                error: 'Deine Video-Konferenz konnt nicht eingetragen werden.',
            },
            modal: {
                title: 'Videocall starten',
                button: 'Jetzt starten',
                text: 'Trage hier den Link zur Video-Konferenz ein',
            },
        },
    },
    myappointments: {
        header: 'Meine Termine',
        linktext: 'Alle',
        noappointments: 'Es wurden keine Termine gefunden.',
    },
    homework: {
        header: 'Hausaufgabenhilfe',
        title: 'Du brauchst Hife bei deinen Hausaufgaben?',
        content: 'Schreibe uns einfach an, wir helfen dir gerne.',
    },
    learningpartner: {
        header: 'Dein:e Lernpartner:in',
        username: 'Max Mustermann',
    },
    relatedcontent: {
        header: 'Vorschläge für dich',
    },
    offers: {
        header: 'Angebote',
        match: 'Match auflösen',
        noMatching: 'Du hast noch keine Matches',
        requestCreated: 'Anfrage erstellt am:',
        clock: 'Uhr',
        waitingTimeInfo: 'Bitte beachte, dass es bei der Suche nach einem:r Lernpartner:in für dich zu Wartezeiten von 3 - 6 Monaten kommen kann.',
        removeRequest: 'Anfrage zurücknehmen',
    },
    helpers: {
        headlines: {
            course: 'Meine Kurse',
            importantNews: 'Wichtige Meldungen',
            myLearningPartner: 'Meine Lernpartner:innen',
            recommend: 'Empfehle uns weiter',
            recommendFriends: 'Empfehle Lern-Fair deinen Freunden',
        },
        contents: {
            recommendFriends:
                'Du stehst hinter der Mission von Lern-Fair für mehr Bildungsgerechtigkeit in Deutschland? Dann erzähle deinen Freunden von Lern-Fair und lass uns gemeinsam noch mehr benachteiligten Kindern und Jugendlichen helfen.',
        },
        buttons: {
            course: 'Neuen Kurs eintragen',
            offer: 'Wichtige Meldungen',
            requestMatchHuH: 'Ein neues Lernpaar bilden',
            requestMatchSuS: 'Auf die Warteliste setzen',
            solveMatch: 'Lernpaar auflösen',
            recommend: 'Jetzt empfehlen',
        },
    },
};
export default dashboard;
