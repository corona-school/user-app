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
        activeMatches: 'Aktive Lernpaare',
        inactiveMatches: 'Aufgelöste Lernpaare',
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
        appointmentsHeadline: 'Termine',
        createAppointment: 'Termin erstellen',
    },
    blocker: {
        header: 'Lernunterstützung',
        title: 'Unterstützung anfragen',
        firstContent:
            'Du benötigst individuelle Unterstützung? Dann ist die Lernunterstützung genau richtig. Wir verbinden dich mit einem:r Helfer:in, der:die dich individuell beim Lernen unterstützt.',
        headlineContent: 'Wichtig',
        contentBox1: 'Es kommt bei der Lernunterstützung zu',
        contentBox2: 'längeren Wartezeiten.',
        contentBox3: 'Nutze in der Zwischenzeit auch unsere Kurse oder unsere Hausaufgabenhilfe.',
        button: 'Unterstützung anfragen',
        ctaCardHeader: 'Gruppen-Kurse',
        ctaCardContent: 'Kurse zu verschiedenen Themen in den Fächern Deutsch, Mathe, Englisch…',
        ctaCardButton: 'Zu den Gruppen-Kursen',
    },
    homeworkhelp: {
        title: 'Hausaufgabenhilfe',
        textpupil:
            'Jeden Tag von Montag - Donnerstag 16h - 17h bieten wir eine Hausaufgabenhilfe auf Zoom an. Du kannst jeden Tag teilnehmen, wenn du Hilfe bei deinen Hausaufgaben brauchst.',
        texthelper:
            'In der Hausaufgabenhilfe kannst du Schüler:innen wie in einer Sprechstunde spontan bei ihren Hausaufgaben helfen. Die Hausaufgabenhilfe findet Montag - Donnerstag 16h - 17h statt. Du kannst dich hier unverbindlich so oft engagieren, wie es dir passt.',
        button: 'Zur Hausaufgabenhilfe',
    },
    pending: {
        modal: {
            title: 'Anfrage zurücknehmen',
            description:
                'Möchtest du die Anfrage wirklich löschen? Damit verlierst du deinen Platz in der Warteschlange und wir werden deinen Platz an andere Schüler:innen vergeben.',
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
            deleteSucess: 'Die Anfrage wurde gelöscht',
            noMatches: 'Du hast (noch) keine Lernpartner:in.',
            noDissolvedMatches: 'Du hast keine aufgelösten Lernpaare.',
            editRequestDescription:
                ' Wenn du deine Angaben änderst, verändert sich deine Wartezeit nicht. Wir informieren dich per E-Mail, sobald du an der Reihe bist und wir eine:n passende:n Lernpartner:in für dich gefunden haben.',
            noRequestsTutee: 'Wir suchen gerade nicht nach einem:r Lernpartner:in für dich.',
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
                    language: 'Deutsch für Anfänger',
                    focus: 'Fokus-Kurse',
                    courses: 'Nachhilfe-Kurse',
                },
            },
        },
        helper: {
            header: 'Gruppen-Kurse',
            title: 'Gruppen-Kurse',
            content:
                'In unseren Kursen hast du die Möglichkeit, mehreren Schüler:innen auf einmal zu helfen. Wir bieten verschiedene Kurs-Formate an: Nachhilfe-Kurse, Fokus-Kurse und "Deutsch für Anfänger".',
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
    dissolve: {
        modal: {
            title: 'Warum möchtest du das Lernpaar auflösen?',
            btn: 'Lernpaar auflösen',
        },
        newMatch: {
            title: 'Neues Lernpaar bilden',
            descriptionPupil:
                'Möchtest du mit einem:r neuen Lernpartner:in verbunden werden? Beachte bitte, dass es wieder einige Zeit dauert bis wir jemanden für dich finden können.',
            descriptionStudent:
                'Möchtest du mit einem:r neuen Lernpartner:in verbunden werden? Wir freuen uns, wenn du (noch) eine:n Schüler:in unterstützt. Danke für dein Engagement!',
        },
    },
    dissolveReasons: {
        student: {
            ghosted: 'Mein:e Lernpartner:in hat sich nicht zurückgemeldet',
            noMoreHelpNeeded: 'Mein:e Lernpartner:in benötigt keine Unterstützung mehr',
            isOfNoHelp: 'Ich konnte meinem/meiner Lernpartner:in nicht behilflich sein',
            noMoreTime: 'Ich habe keine Zeit mehr mein*e Lernpartner:in zu unterstützen',
            personalIssues: 'Wir hatten Schwierigkeiten auf zwischenmenschlicher Ebene',
            scheduleIssues: 'Wir konnten keine gemeinsamen Termine finden',
            technicalIssues: 'Wir hatten technische Schwierigkeiten',
            languageIssues: 'Wir hatten sprachliche Schwierigkeiten',
            other: 'Sonstiges',
        },
        pupil: {
            ghosted: 'Mein:e Lernpartner:in hat sich nicht zurückgemeldet',
            isOfNoHelp: 'Mein:e Lernpartner:in konnte mir nicht behilflich sein',
            noMoreTime: 'Mein:e Lernpartner:in hat keine Zeit mehr mich zu unterstützen',
            noMoreHelpNeeded: 'Ich benötige keine Unterstützung mehr',
            personalIssues: 'Wir hatten Schwierigkeiten auf zwischenmenschlicher Ebene',
            scheduleIssues: 'Wir konnten keine gemeinsamen Termine finden',
            technicalIssues: 'Wir hatten technische Schwierigkeiten',
            languageIssues: 'Wir hatten sprachliche Schwierigkeiten',
            other: 'Sonstiges',
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
    adHocMeeting: {
        title: 'Sofortbesprechung starten',
        infoText:
            'Wir legen automatisch einen Termin für dich an und informieren dein:e Schüler:in per E-Mail sobald du eine Sofortbesprechung startest. Prinzipiell kannst du Termine mit deinem:r Schüler:in auch vorab im User-Bereich planen und anlegen.',
        startMeeting: 'Besprechung starten',
    },
};

export default matching;
