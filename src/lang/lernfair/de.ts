const lernfair = {
    languages: {
        albanisch: 'Albanisch',
        arabisch: 'Arabisch',
        armenisch: 'Armenisch',
        aserbaidschanisch: 'Aserbaidschanisch',
        bosnisch: 'Bosnisch',
        bulgarisch: 'Bulgarisch',
        chinesisch: 'Chinesisch',
        deutsch: 'Deutsch',
        englisch: 'Englisch',
        franz_sisch: 'Französisch',
        französisch: 'Französisch',
        italienisch: 'Italienisch',
        kasachisch: 'Kasachisch',
        kurdisch: 'Kurdisch',
        polnisch: 'Polnisch',
        portugiesisch: 'Portugiesisch',
        russisch: 'Russisch',
        spanisch: 'Spanisch',
        // t_rkisch: 'Türkisch',
        ukrainisch: 'Ukrainisch',
        vietnamesisch: 'Vietnamesisch',
        other: 'Andere',
        andere: 'Andere',
    },
    subjects: {
        Altgriechisch: 'Altgriechisch',
        Biologie: 'Biologie',
        Chemie: 'Chemie',
        Chinesisch: 'Chinesisch',
        Deutsch: 'Deutsch',
        'Deutsch als Zweitsprache': 'Deutsch als Zweitsprache',
        Englisch: 'Englisch',
        Erdkunde: 'Erdkunde',
        Französisch: 'Französisch',
        Geschichte: 'Geschichte',
        Informatik: 'Informatik',
        Italienisch: 'Italienisch',
        Kunst: 'Kunst',
        Latein: 'Latein',
        Mathematik: 'Mathematik',
        Musik: 'Musik',
        Niederländisch: 'Niederländisch',
        Pädagogik: 'Pädagogik',
        Philosophie: 'Philosophie',
        Physik: 'Physik',
        Politik: 'Politik',
        Religion: 'Religion',
        Russisch: 'Russisch',
        Sachkunde: 'Sachkunde',
        Spanisch: 'Spanisch',
        Wirtschaft: 'Wirtschaft',
    },
    states: {
        bw: 'Baden-Württemberg',
        by: 'Bayern',
        be: 'Berlin',
        bb: 'Brandenburg',
        hb: 'Bremen',
        hh: 'Hamburg',
        he: 'Hessen',
        mv: 'Mecklenburg-Vorpommern',
        ni: 'Niedersachsen',
        nw: 'Nordrhein-Westfalen',
        rp: 'Rheinland-Pfalz',
        sl: 'Saarland',
        sn: 'Sachsen',
        st: 'Sachsen-Anhalt',
        sh: 'Schleswig-Holstein',
        th: 'Thüringen',
        other: 'Andere',
    },
    schooltypes: {
        grundschule: 'Grundschule',
        hauptschule: 'Hauptschule',
        realschule: 'Realschule',
        gymnasium: 'Gymnasium',
        gesamtschule: 'Gesamtschule',
        other: 'Andere',
        berufsschule: 'Berufsschule',
        f_rderschule: 'Förderschule',
    },
    schoolclass: '{{class}}. Klasse',

    reason: {
        course: {
            // from backend/graphql/student/fields.ts
            instructor: {
                'not-instructor': 'Du bist noch nicht als Kursleiter:in registriert.',
                'not-screened': 'Du bist noch nicht als Kursleiter:in freigeschaltet. Bitte führe zuerst dein Kennenlerngespräch mit uns.',
                null: 'Du darfst eigentlich neue Kurse erstellen ... Probier mal dich neu anzumelden ...',
            },
            // from backend/common/courses/participants.ts
            pupil: {
                'subcourse-full': 'Dieser Kurs ist leider ausgebucht.',
                'grade-to-high':
                    'Du kannst dich nicht zu diesem Kurs anmelden, weil du nicht in der vorgesehenen Jahrgangsstufe bist. Der Kurs ist für jüngere Schüler:innen gedacht.',
                'grade-to-low':
                    'Du kannst dich nicht zu diesem Kurs anmelden, weil du nicht in der vorgesehenen Jahrgangsstufe bist. Der Kurs ist für ältere Schüler:innen gedacht.',
                'no-lectures': 'Du kannst dich nicht anmelden, da keine Lektionen für diesen Kurs angelegt wurden.',
                'already-started': 'Du kannst dich nicht mehr zum Kurs anmelden, da er bereits gestartet ist.',
                'already-participant': 'Du bist bereits für diesen Kurs angemeldet.',
                'not-participant':
                    'Du kannst dich nicht anmelden, weil dein Account für Gruppen-Kurse nicht freigeschaltet ist. Bitte wende dich an support@lern-fair.de, wenn du an diesem Kurs teilnehmen möchtest.',
            },
        },
        // from backend/commmon/match/requests.ts
        matching: {
            tutor: {
                'not-screened': 'Du kannst noch kein Lernpaar bilden. Bitte führe zuerst dein Kennenlerngespräch mit uns.',
                'not-tutor': 'Du kannst kein Lernpaar bilden, da du nicht für die Lernunterstützung registriert bist.',
                'max-requests': 'Du hast die maximale Zahl an erlaubten Anfragen erreichst und kannst daher keine weitere stellen.',
            },
            pupil: {
                'max-dissolved-matches': 'Du kannst kein Lernpaar anfordern, weil du bereits zu viele Lernpaare hattest.',
                'not-tutee': 'Du kannst kein Lernpaar anfordern, da du nicht für die Lernunterstützung registriert bist.',
                'max-requests': 'Du bist bereits auf der Warteliste.',
                'max-matches':
                    'Aufgrund der hohen Nachfrage kannst du nur ein:e Lernpartner:in gleichzeitig haben. Solltest du nicht mehr mit deinem:r Lernpartner:in zusammenarbeiten, löse die Verbindung auf.',
                deactivated:
                    'Die Registrierung für die 1:1-Lernunterstützung ist aufgrund zu hoher Nachfrage vorübergehend geschlossen. Wenn du bereits eine Anfrage für eine Lernunterstützung gestellt hast, melden wir uns in nächster Zeit mit einer E-Mail bei dir zum weiteren Vorgehen. Nutze in der Zwischenzeit gerne unsere anderen Angebote. ',
            },
        },
    },
};

export default lernfair;
// Subject[]