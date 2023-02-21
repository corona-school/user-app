const matching = {
    blocker: {
        header: 'Lernunterstützung',
        title: 'Unterstützung anfragen',
        firstContent:
            'Du benötigst individuelle Unterstützung? Dann ist die Lernunterstützung genau richtig. Hier kannst du eine:n neue:n Student:in anfordern, die dich beim Lernen unterstützt.',
        headlineContent: 'Wichtig',
        contentBox1: 'Da es bei der Lernunterstützung zu',
        contentBox2: 'langen Wartezeiten von 3-6 Monaten',
        contentBox3: 'bieten wir zusätzlich Gruppen-Kurse an.',
        button: 'Unterstützung anfragen',
        ctaCardHeader: 'Gruppen-Kurse',
        ctaCardContent: 'Kurse zu verschiedenen Themen in den Fächern Deutsch, Mathe, Englisch…',
        ctaCardButton: 'Zu den Gruppen-Kursen',
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
            header: 'Lernunterstützung',
            title: 'Match anfordern',
            content: 'Die Lernunterstützung ist eine 1:1-Betreuung für Schüler:innen, die individuelle Hilfe benötigen.',
            requestmatchButton: 'Lernpaar bilden',
            tabs: {
                tab1: 'Aktuelle Lernpartner:innen',
                tab2: 'Suche',
            },
            request: 'Anfrage',
            removeRequest: 'Anfrage zurücknehmen',
            deleteRequest: 'Anfrage löschen',
            areyousuretodelete: 'Möchtest du die Anfrage wirklich löschen?',
            subjects: 'Fächer:',
            noMatches: 'Du hast (noch) keine Lernpartner:in.',
            noRequestsTutee:
                'Wir suchen gerade nicht nach einem:r Lernpartner:in für dich. Drücke auf "Lernpaar bilden"-Button, um mit einer:m Helfer:in verbunden zu werden.',
            noRequestsTutor:
                'Wir suchen gerade nicht nach einem:r neuen/weiteren Lernpartner:in für dich. Wenn du mit einem:r (weiteren) Schüler:in verbunden werden möchtest, um sie zu unterstützen, drücke auf "Lernpaar bilden"-Button.',
            resolveMatch: 'Das Match wurde aufgelöst',
        },
        updateData: 'Deine Daten wurden aktualisiert',
        daz: {
            heading: 'Deutsch als Zweitsprache',
            description:
                ' Kannst du dir vorstellen, Schüler:innen zu unterstützen, die Deutsch als Zweitsprache sprechen und nur über wenige Deutschkenntnisse verfügen?',
        },
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
            header: 'Gruppen-Kurse',
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
            header: 'Gruppen-Kurse',
            title: 'Gruppen-Kurse',
            content:
                'Mit den Gruppen-Kursen hilfst du einer Kleingruppe an Schüler:innen, die sich alle in einem bestimmten Thema verbessern wollen. Das Thema kannst du selbst festlegen - ob Bruchrechnung, past tense oder Gedichtanalyse… Hohe Nachfrage herrscht vor allem in den Hauptfächern. Auch den Zeitpunkt legst du selbst fest: Von einem Einzeltermin bis zu einem ca. 12-wöchigen Kurs ist alles möglich. Die Schüler:innen buchen die von dir vorgegebenen Termine.',
            contentHeadline: 'Wichtig',
            contentHeadlineContent: 'Gruppen-Kurse müssen mind. 7 Tage vor Kursbeginn angelegt werden.',
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
            9: 'Wir hatten sprachliche Schwierigkeiten',
            8: 'Sonstiges',
        },
        pupil: {
            1: 'Mein:e Lernpartner:in hat sich nicht zurückgemeldet',
            2: 'Mein:e Lernpartner:in konnte mir nicht behilflich sein',
            3: 'Mein:e Lernpartner:in hat keine Zeit mehr mich zu unterstützen',
            4: 'Ich benötige keine Unterstützung mehr',
            5: 'Wir hatten Schwierigkeiten auf zwischenmenschlicher Ebene',
            6: 'Wir konnten keine gemeinsamen Termine finden',
            7: 'Wir hatten technische Schwierigkeiten',
            9: 'Wir hatten sprachliche Schwierigkeiten',
            8: 'Sonstiges',
        },
    },
};

export default matching;
