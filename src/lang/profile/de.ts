const profile = {
    title: 'Mein Profil',
    successmessage: 'Änderungen wurden erfolgreich gespeichert.',
    errormessage: 'Deine Änderungen konnten nicht gespeichert werden.',
    editprofile: 'Profilbild ändern',
    birthday: 'Geburtsdatum ändern',
    type: 'Art der Unterstützung:',
    availability: 'Verfügbarkeit verwalten',
    noInfo: 'Keine Angabe',
    ProfileCompletion: {
        name: 'Profilvollständigkeit',
    },
    PersonalData: 'Persönliche Daten',
    UserName: {
        label: {
            title: 'Dein Name',
            firstname: 'Vorname',
            lastname: 'Nachname',
        },
        popup: {
            header: 'Name ändern',
            label: 'Dein Name',
            save: 'Speichern',
            exit: 'Abbrechen',
        },
    },
    AboutMe: {
        label: 'Über mich',
        empty: 'Keine Angabe',
        popup: {
            header: 'Über mich Text ändern',
            label: 'Dein Text',
            save: 'Speichern',
            exit: 'Abbrechen',
        },
    },
    FluentLanguagenalData: {
        label: 'Fließende Sprache',
        empty: 'Keine Angabe',
        single: {
            header: 'Sprache ändern',
            title: 'Meine Sprachen',
            others: 'Weitere Sprachen',
            button: 'Auswahl speichern',
            optional: {
                label: 'Andere Schulform',
                placeholder: 'Gebe deine Schulform an.',
            },
        },
    },
    State: {
        empty: 'Keine Angabe',
        label: 'Bundesland',
        single: {
            selectedStates: 'Mein Bundesland',
            otherStates: 'Weitere Bundesländer',
            header: 'Bundesland ändern',
            title: 'Mein Bundesland',
            others: 'Bundesland wählen',
            button: 'Auswahl speichern',
        },
    },
    SchoolType: {
        label: 'Schulform',
        empty: 'Keine Angabe',
        single: {
            header: 'Schulform ändern',
            title: 'Meine Schulform',
            others: 'Weitere Schulformen',
            button: 'Auswahl speichern',
            optional: {
                label: 'Andere Schulform',
                placeholder: 'Gebe deine Schulform an.',
            },
        },
    },
    SchoolClass: {
        label: 'Klasse',
        empty: 'Keine Angabe',
        single: {
            header: 'Schulklasse ändern',
            title: 'Gewählte Schulklasse',
            others: 'Weitere Klassen',
            button: 'Auswahl speichern',
            optional: {
                label: 'Andere Klasse',
                placeholder: 'Gebe deine Klasse an.',
            },
        },
    },
    subjects: {
        label: 'Meine Fächer',
        empty: 'Keine Fächer angegeben',
        single: {
            title: 'Meine Fächer',
        },
    },
    NeedHelpIn: {
        label: 'Fächer, in denen ich mir Hilfe wünsche',
        empty: 'Es wurden keine Fächer angegeben',
        single: {
            header: 'Fächer ändern',
            title: 'Fächer, in denen ich mir Hilfe wünsche',
            others: 'Weitere Fächer wählen',
            button: 'Auswahl speichern',
            optional: {
                label: 'Anderes Fach',
                placeholder: 'Welche Fächer möchtest du wählen?',
            },
        },
    },
    Helper: {
        certificate: {
            title: 'Meine Bescheinigungen',
            tabbestaetigt: 'Bestätigt',
            tabausstehend: 'Ausstehend',
            button: 'Bescheinigung anfordern',
            status: {
                awaiting: 'ausstehend',
                manual: 'manuell bestätigt',
                approved: 'genehmigt',
                unknown: 'unbekannt',
            },
        },
    },
    Notice: {
        noLanguage: 'Es wurden keine Sprachen angegeben',
        noState: 'Es wurde kein Bundesland angegeben',
        noSchoolType: 'Es wurde keine Schulform angegeben',
        noSchoolGrade: 'Es wurde keine Klasse angegeben',
        noSchoolSubject: 'Es wurde keine Fächer angegeben',
    },
    Deactivate: {
        error: 'Dein Account konnte nicht deaktiviert werden.',
        modal: {
            title: 'Account deaktivieren',
            btn: 'Account deaktivieren',
            other: {
                placeholder: 'Deaktivierungsgrund',
            },
            description: {
                pupil: 'Sobald du deinen Account deaktivierst, werden deine Zuordnungen aufgelöst und du von allen Kursen abgemeldet. Wir informieren deine:n aktive:n Lernpartner:in automatisch über diese Änderung. Falls du zu einem späteren Zeitpunkt wieder Teil von Lern-Fair werden möchtest, kannst du dich jederzeit bei uns melden.',
                student:
                    'Sobald du deinen Account deaktivierst, werden deine Zuordnungen aufgelöst und deine Kurse abgesagt. Wir informieren deine aktiven Lernpartner:innen automatisch über diese Änderung. Falls du zu einem späteren Zeitpunkt wieder Teil von Lern-Fair werden möchtest, kannst du dich jederzeit bei uns melden.',
            },
        },
        pupil: {
            0: 'Ich habe keine Zeit mehr.',
            1: 'Ich habe kein Interesse mehr.',
            2: 'Ich habe mich nur zu Testzwecken angemeldet.',
            3: 'Ich habe eine andere Möglichkeit gefunden, Unterstützung zu erhalten.',
            4: 'Ich habe mir das Programm anders vorgestellt.',
            5: 'Ich erfülle die Zugangsvoraussetzungen für die Projekte nicht.',
            6: 'Sonstiges',
        },
        student: {
            0: 'Ich habe keine Zeit mehr mich zu engagieren.',
            1: 'Ich konnte/wollte das Kennenlerngespräch nicht wahrnehmen.',
            2: 'Ich habe kein Interesse mehr.',
            3: 'Ich habe mich nur zu Testzwecken angemeldet.',
            4: 'Ich habe eine andere Möglichkeit gefunden mich zu engagieren.',
            5: 'Ich habe mir das Programm anders vorgestellt.',
            6: 'Ich erfülle die Zugangsvoraussetzungen für die Projekte nicht.',
            7: 'Sonstiges',
        },
    },
};

export default profile;
