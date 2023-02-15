const matching = {
    blocker: {
        header: '1:1-Lernunterstützung',
        title: 'Unterstützung anfragen',
        firstContent:
            'Du benötigst individuelle Unterstützung? Dann ist die 1:1 Lernunterstützung genau richtig. Hier kannst du eine:n neue:n Student:in anfordern, die dich beim Lernen unterstützt.',
        headlineContent: 'Wichtig',
        contentBox1: 'Da es bei der 1:1-Lernunterstützung zu',
        contentBox2: 'langen Wartezeiten von 3-6 Monaten',
        contentBox3: 'bieten wir zusätzlich Gruppen-Nachhilfe an.',
        button: 'Unterstützung anfragen',
        ctaCardHeader: 'Gruppen-Lernunterstützung',
        ctaCardContent: 'Kurzfristige Unterstützung bei spezifischen Problemen und Fragen',
        ctaCardButton: 'Zu den Gruppenkursen',
    },
    pending: {
        modal: {
            buttons: {
                dissolve: 'Anfrage zurücknehmen',
                nothing: 'Keine Angabe machen',
            },
        },
    },
    request: {
        buttons: {
            dissolve: 'Match auflösen',
        },
        check: {
            header: '1:1-Lernunterstützung',
            title: 'Match anfordern',
            content: 'Die 1:1 Lernunterstützung ist eine 1:1 Betreuung für Schüler:innen, die individuelle Hilfe benötigen.',
            contentHeadline: 'Wichtig',
            contenHeadlineContent: 'Es kann bis zu einer Woche dauern, ehe wir ein Match für dich gefunden haben.',
            requestmatchButton: 'Match anfordern',
            tabs: {
                tab1: 'Matches',
                tab2: 'Anfragen',
            },
            request: 'Anfrage',
            removeRequest: 'Anfrage zurücknehmen',
            deleteRequest: 'Anfrage löschen',
            areyousuretodelete: 'Möchtest du die Anfrage wirklich löschen?',
            cancel: 'Abbrechen',
            subjects: 'Fächer:',
            noMatches: 'Du hast keine Matches',
            noRequests: 'Wir suchen gerade nicht nach einem:r neuen Lernpartner:in für dich.',
            resolveMatch: 'Das Match wurde aufgelöst',
        },
        updateData: 'Deine Daten wurden aktualisiert',
    },
    group: {
        tabs: {
            tab1: {
                title: 'Meine Kurse',
                content: 'Unsere Empfehlungen basieren auf den Angaben in deinem Profil.',
            },
            tab2: {
                title: 'Empfehlungen',
                content: 'Unsere Empfehlungen basieren auf den Angaben in deinem Profil.',
            },
            tab3: {
                title: 'Alle Angebote',
                content: 'Unsere Empfehlungen basieren auf den Angaben in deinem Profil.',
            },
        },
        error: {
            nofound: 'Es wurden keine Kurse gefunden. Bitte passe deine Suche an.',
        },
        pupil: {
            header: 'Gruppen-Lernunterstützung',
            title: 'Angebote',
            content:
                'Auf diese Seite findest du deine Kurse, Empfehlungen für dich und weitere Angebote. Du suchst etwas Spezielles? Dann nutze doch unsere Suchfunktion.',
            tabs: {
                tab1: {
                    title: 'Meine Kurse',
                },
                tab2: {
                    title: 'Alle Kurse',
                },
            },
        },
        helper: {
            header: 'Gruppenkurse',
            title: 'Gruppenkurse',
            content: 'Gruppenkurse bieten eine kurzfristige Unterstützung bei spezifischen Problemen und Fragen.',
            contentHeadline: 'Wichtig',
            contentHeadlineContent: 'Gruppenkurse müssen mind. 7 Tage vor Kursbeginn angelegt werden.',
            button: 'Kurs anlegen',
            course: {
                title: 'Meine Kurse',
                tabs: {
                    tab1: {
                        title: 'Kurse',
                    },
                    tab2: {
                        title: 'In Prüfung',
                    },
                    tab3: {
                        title: 'Entwürfe / Unveröffentlicht',
                    },
                    tab4: {
                        title: 'Vergangene Kurse',
                    },
                },
            },
            otherCourses: {
                title: 'Kurse von Anderen',
            },
            alert: {
                successfulEditing: 'Dein Kurs wurde erfolgreich bearbeitet.',
                successfulCreation:
                    'Dein Kurs wurde erfolgreich erstellt. Solltest du ihn nicht direkt zur Prüfung freigegeben haben, vergiss das bitte nicht. Nur so können wir deinen Kurs rechtzeitig veröffentlichen.',
                // successfulCreationNotSubmitted: 'Dein Kurs wurde erfolgreich erstellt, aber noch nicht zur Prüfung freigegeben. Bitte vergiss nicht, das noch zu tun, damit wir deinen Kurs rechtzeitig veröffentlichen können.',
            },
        },
    },
    status: { dissolved: 'Das Match wurde aufgelöst.' },
    dissolveModal: {
        title: 'Match auflösen',
        btn: 'Match auflösen',
    },
    dissolveReasons: {
        student: {
            1: 'Mein:e Lernpartner:in hat sich nicht zurückgemeldet',
            2: 'Mein:e Lernpartner:in benötigt keine Unterstützung mehr',
            3: 'Ich konnte meinem/meiner Lernpartner:in nicht behilflich sein',
            4: 'Ich habe keine Zeit mehr mein*e Lernpartner:in zu unterstützen',
            5: 'Wir hatten Schwierigkeiten auf zwischenmenschlicher Ebene',
            6: 'Wir konnten keine gemeinsamen Termine finden',
            7: 'Wir hatten technische Schwierigkeiten',
            8: 'Wir hatten sprachliche Schwierigkeiten',
            9: 'Sonstiges',
        },
        pupil: {
            1: 'Mein:e Lernpartner:in hat sich nicht zurückgemeldet',
            2: 'Mein:e Lernpartner:in konnte mir nicht behilflich sein',
            3: 'Mein:e Lernpartner:in hat keine Zeit mehr mich zu unterstützen',
            4: 'Ich benötige keine Unterstützung mehr',
            5: 'Wir hatten Schwierigkeiten auf zwischenmenschlicher Ebene',
            6: 'Wir konnten keine gemeinsamen Termine finden',
            7: 'Wir hatten technische Schwierigkeiten',
            8: 'Wir hatten sprachliche Schwierigkeiten',
            9: 'Sonstiges',
        },
    },
};

export default matching;
