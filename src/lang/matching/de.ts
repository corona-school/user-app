const matching = {
    shared: {
        subjects: 'Fächer:',
        schooltype: 'Schulform:',
        class: 'Klasse:',
        state: 'Status:',
        videochat: 'Videochat',
        contact: 'Kontaktieren',
        dissolve: 'Lernpaar auflösen',
        active: 'aktiv',
        inactive: 'inaktiv',
        activeMatches: 'Aktive Zuordnungen',
        inactiveMatches: 'Aufgelöste Zuordnungen',
        schoolGrade: '{{schooltype}} • {{grade}} ',
        showMore: 'Mehr anzeigen',
        showLess: 'Weniger anzeigen',
        contactViaChat: 'Per Chat kontaktieren',
        directCall: 'Sofortbesprechung starten',
        dissolveMatch: 'Lernpaar auflösen',
        dissolved: 'Das Lernpaar wurde aufgelöst.',
        dissolvedAlert: 'Lernpaar wurde aufgelöst: Deine Zusammenarbeit mit {{partnerName}} wurde beendet.',
        contactMail: 'Via E-Mail kontaktieren',
        tutorInstructor: 'Tutor:in, Kursleiter:in',
    },
    blocker: {
        header: 'Lernunterstützung',
        title: 'Unterstützung anfragen',
        firstContent:
            'Du benötigst individuelle Unterstützung? Dann ist die Lernunterstützung genau richtig. Wir verbinden dich mit einem:r Helfer:in, der:die dich individuell beim Lernen unterstützt.',
        headlineContent: 'Wichtig',
        contentBox1: 'Es kommt bei der Lernunterstützung zu',
        contentBox2: 'langen Wartezeiten von 3-6 Monaten.',
        contentBox3: 'Schau dir daher auch unsere Gruppen-Kurse an.',
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
        check: {
            header: 'Lernunterstützung',
            title: 'Lernunterstützung',
            content:
                'In der Lernunterstützung hilfst du bildungsbenachteiligten Schüler:innen einzeln und individuell. Die Zeit, Dauer und Inhalte eurer digitalen Treffen vereinbart ihr in eurem Lernpaar untereinander. Du kannst mehrere Lernpaare parallel bilden und wir würden uns freuen, wenn du im Rahmen deiner zeitlichen Möglichkeiten eine:n weitere:n Schüler:in unterstützen kannst. Wenn du eine Lernunterstützung nicht mehr fortführen kannst oder möchtest, kannst du das entsprechende Lernpaar hier auflösen.',
            tabs: {
                tab1: 'Lernpaare',
                tab2: 'Anfragen',
            },
            request: 'Anfrage',
            removeRequest: 'Anfrage zurücknehmen',
            editRequest: 'Anfrage bearbeiten',
            deleteRequest: 'Anfrage löschen',
            areyousuretodelete: 'Möchtest du die Anfrage wirklich löschen?',
            noMatches: 'Du hast (noch) keine Lernpartner:in.',
            noDissolvedMatches: 'Du hast keine aufgelösten Zuordnungen.',
            editRequestDescription:
                ' Wenn du deine Angaben änderst, verändert sich deine Wartezeit nicht. Wir informieren dich per E-Mail sobald du an der Reihe bist und wir eine:n passende:n Lernpartner:in für dich gefunden haben.',
            noRequestsTutee:
                'Wir suchen gerade nicht nach einem:r Lernpartner:in für dich. Drücke auf "Lernpaar bilden"-Button, um mit einer:m Helfer:in verbunden zu werden.',
            noRequestsTutor:
                'Wir suchen gerade nicht nach einem:r neuen/weiteren Lernpartner:in für dich. Wenn du mit einem:r (weiteren) Schüler:in verbunden werden möchtest, um sie zu unterstützen, drücke auf "Lernpaar bilden"-Button.',
            resolveMatch: 'Das Lernpaar wurde aufgelöst',
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
                'Auf dieser Seite findest du deine Kurse, Empfehlungen für dich und weitere Angebote. Du suchst etwas Spezielles? Dann nutze doch unsere Suchfunktion.',
            tabs: {
                tab1: {
                    title: 'Meine Kurse',
                },
                tab2: {
                    title: 'Alle Kurse',
                    current: 'Aktuelle Kurse',
                    past: 'Vergangene Kurse',
                    language: 'Deutsch-Kurse',
                    focus: 'Fokus-Kurse',
                    courses: 'Nachhilfe-Kurse',
                },
            },
        },
        helper: {
            header: 'Gruppen-Kurse',
            title: 'Gruppen-Kurse',
            content:
                'In unseren Kursen hast du die Möglichkeit, mehreren Schüler:innen auf einmal zu helfen. Wir bieten verschiedene Kurs-Formate an: Nachhilfe-Kurse, Deutsch-Kurse und Fokus-Kurse.',
            button: 'Kurs anlegen',
            course: {
                title: 'Meine Kurse',
                tabs: {
                    tab1: {
                        title: 'Meine Kurse',
                        current: 'Aktuelle Kurse (veröffentlicht)',
                        draft: 'Entwurf oder in Prüfung',
                        past: 'Vergangene und abgesagte Kurse',
                    },
                    tab2: {
                        title: 'Alle Kurse',
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
    status: { dissolved: 'Das Lernpaar wurde aufgelöst.' },
    dissolveModal: {
        title: 'Lernpaar auflösen',
        btn: 'Lernpaar auflösen',
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
    certificate: {
        titleRequest: 'Bescheinigung bestätigen',
        title: 'Lernunterstützung von {{firstname}}',
        from: 'ab dem',
        to: 'bis zum',
        approx: 'ca.',
        sign: 'Unterschreiben',
        correctInformation: 'Stimmen diese Informationen?',
        hoursPerWeek: 'Stunden pro Woche',
        totalHours: 'Stunden insgesamt',
        contents: 'Inhalte:',
        requestChange: 'Bitte {{firstname}} die Informationen anzupassen',
        requestInstructions: '{{firstname}} kann die Informationen in seinem:ihrem Userbereich anpassen.',
        areYou18: 'Bist du volljährig (18 Jahre oder älter)?',
        askYourParents: 'Bitte deine Eltern um Bestätigung',
        signInstructionsParents: 'Auf der folgenden Seite müssen deine Eltern unterschreiben, um zu bestätigen, dass {{firstname}} dich unterstützt hat.',
        signPlace: 'Ort der Unterschrift',
        goToSign: 'Zur Unterschrift',
        dateFiller: 'den',
        signatureParent: 'Unterschrift deines Erziehungsberechtigten',
        signatureYour: 'Deine Unterschrift',
        success: 'Zertifikat bestätigt',
        successInfo: 'Vielen Dank, dass du uns unterstützt, die Arbeit unserer Helfer:innen zu würdigen.',
    },
};

export default matching;
