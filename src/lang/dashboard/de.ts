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
        noMatching: 'Du hast gerade kein aktives Lernpaar',
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
            openedRequests: 'Suche nach Lernpartner:innen',
            recommend: 'Empfiehl uns weiter',
            recommendFriends: 'Empfiehl Lern-Fair deinen Freunden',
        },
        contents: {
            recommendFriends:
                'Du stehst hinter der Mission von Lern-Fair für mehr Bildungsgerechtigkeit in Deutschland? Dann erzähle deinen Freunden von Lern-Fair und lass uns gemeinsam noch mehr benachteiligten Kindern und Jugendlichen helfen.',
            recommendText:
                'Hey, ich engagiere mich ehrenamtlich bei Lern-Fair e.V. für mehr Bildungschancen und Gerechtigkeit in Deutschland. Vielleicht wäre das ja auch etwas für dich? Es ist total einfach und komplett flexibel, da alles online stattfindet und du von zuhause aus mitmachen kannst. Ich würde mich freuen, wenn du dabei wärst! Alle Infos findest du auf der Website: www.lern-fair.de',
            toast: 'Text in die Zwischenablage kopiert.',
        },
        buttons: {
            course: 'Neuen Kurs eintragen',
            offer: 'Wichtige Meldungen',
            requestMatchHuH: 'Ein neues Lernpaar bilden',
            requestMatchSuS: 'Auf die Warteliste setzen',
            solveMatch: 'Lernpaar auflösen',
            recommend: 'Jetzt empfehlen',
        },
        channels: {
            whatsApp: 'WhatsApp',
            signal: 'Signal',
            email: 'E-Mail',
        },
    },
    noproposalsPupil: 'Wir haben gerade keine neuen Vorschläge für dich. Schau später nochmal vorbei!',
};
export default dashboard;
